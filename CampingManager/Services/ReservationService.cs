using CampingManager.Data;
using CampingManager.Dto;
using CampingManager.Interfaces;
using CampingManager.Models;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Services
{
    public class ReservationService : IReservationService
    {
        private static readonly ReservationStatus[] BlockingStatuses =
        [
            ReservationStatus.Pending,
            ReservationStatus.Confirmed,
            ReservationStatus.CheckedIn
        ];

        private readonly AppDbContext _context;

        public ReservationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<ReservationDto>> GetAllAsync(ReservationQueryDto queryDto)
        {
            var query = _context.Reservations.AsNoTracking();

            if (queryDto.CustomerId.HasValue)
            {
                query = query.Where(reservation => reservation.CustomerId == queryDto.CustomerId.Value);
            }

            if (queryDto.PitchId.HasValue)
            {
                query = query.Where(reservation => reservation.PitchId == queryDto.PitchId.Value);
            }

            if (queryDto.Status.HasValue)
            {
                query = query.Where(reservation => reservation.Status == queryDto.Status.Value);
            }

            if (queryDto.FromDate.HasValue)
            {
                var fromDate = queryDto.FromDate.Value.Date;
                query = query.Where(reservation => reservation.CheckOutDate > fromDate);
            }

            if (queryDto.ToDate.HasValue)
            {
                var toDate = queryDto.ToDate.Value.Date;
                query = query.Where(reservation => reservation.CheckInDate < toDate);
            }

            if (!string.IsNullOrWhiteSpace(queryDto.Search))
            {
                var normalizedSearch = queryDto.Search.Trim().ToLower();

                query = query.Where(reservation =>
                    reservation.ReservationCode.ToLower().Contains(normalizedSearch) ||
                    reservation.Customer.FirstName.ToLower().Contains(normalizedSearch) ||
                    reservation.Customer.LastName.ToLower().Contains(normalizedSearch) ||
                    reservation.Customer.Email.ToLower().Contains(normalizedSearch) ||
                    reservation.Pitch.PitchNumber.ToLower().Contains(normalizedSearch));
            }

            return await query
                .OrderBy(reservation => reservation.CheckInDate)
                .ThenBy(reservation => reservation.Pitch.PitchNumber)
                .Select(reservation => new ReservationDto
                {
                    Id = reservation.Id,
                    ReservationCode = reservation.ReservationCode,
                    CustomerId = reservation.CustomerId,
                    CustomerFullName = reservation.Customer.FirstName + " " + reservation.Customer.LastName,
                    CustomerEmail = reservation.Customer.Email,
                    PitchId = reservation.PitchId,
                    PitchNumber = reservation.Pitch.PitchNumber,
                    PitchName = reservation.Pitch.PitchName,
                    CheckInDate = reservation.CheckInDate,
                    CheckOutDate = reservation.CheckOutDate,
                    AdultsCount = reservation.AdultsCount,
                    ChildrenCount = reservation.ChildrenCount,
                    PetsCount = reservation.PetsCount,
                    CampingEquipmentTypeId = reservation.CampingEquipmentTypeId,
                    CampingEquipmentTypeCode = reservation.CampingEquipmentType.Code,
                    CampingEquipmentTypeName = reservation.CampingEquipmentType.Name,
                    VehiclePlate = reservation.VehiclePlate,
                    Status = reservation.Status,
                    Notes = reservation.Notes,
                    CreatedAt = reservation.CreatedAt,
                    UpdatedAt = reservation.UpdatedAt
                })
                .ToPagedResultAsync(queryDto.PageNumber, queryDto.PageSize);
        }

        public async Task<ServiceResult<IReadOnlyList<PitchAvailabilityDto>>> GetAvailabilityAsync(
            ReservationAvailabilityQueryDto queryDto)
        {
            var checkInDate = queryDto.FromDate.Date;
            var checkOutDate = queryDto.ToDate.Date;

            if (checkInDate >= checkOutDate)
            {
                return ServiceResult<IReadOnlyList<PitchAvailabilityDto>>.Failure(
                    ServiceErrorType.Validation,
                    "ToDate must be after FromDate.");
            }

            var pitches = await _context.Pitches
                .AsNoTracking()
                .Where(pitch => pitch.IsActive)
                .OrderBy(pitch => pitch.PitchNumber)
                .Select(pitch => new
                {
                    pitch.Id,
                    pitch.PitchNumber,
                    pitch.PitchName
                })
                .ToListAsync();

            var blockingReservations = await _context.Reservations
                .AsNoTracking()
                .Where(reservation =>
                    reservation.Id != queryDto.ExcludeReservationId &&
                    BlockingStatuses.Contains(reservation.Status) &&
                    reservation.CheckInDate < checkOutDate &&
                    checkInDate < reservation.CheckOutDate)
                .Select(reservation => new
                {
                    reservation.PitchId,
                    reservation.ReservationCode
                })
                .ToListAsync();

            var blockingCodesByPitch = blockingReservations
                .GroupBy(reservation => reservation.PitchId)
                .ToDictionary(
                    group => group.Key,
                    group => (IReadOnlyList<string>)group
                        .Select(reservation => reservation.ReservationCode)
                        .OrderBy(code => code)
                        .ToList());

            var availability = pitches
                .Select(pitch =>
                {
                    blockingCodesByPitch.TryGetValue(pitch.Id, out var blockingCodes);

                    return new PitchAvailabilityDto
                    {
                        PitchId = pitch.Id,
                        PitchNumber = pitch.PitchNumber,
                        PitchName = pitch.PitchName,
                        IsAvailable = blockingCodes is null || blockingCodes.Count == 0,
                        BlockingReservationCodes = blockingCodes ?? []
                    };
                })
                .Where(availability => queryDto.IncludeUnavailable || availability.IsAvailable)
                .ToList();

            return ServiceResult<IReadOnlyList<PitchAvailabilityDto>>.Success(availability);
        }

        public async Task<ReservationDto?> GetByIdAsync(int id)
        {
            return await _context.Reservations
                .AsNoTracking()
                .Where(reservation => reservation.Id == id)
                .Select(reservation => new ReservationDto
                {
                    Id = reservation.Id,
                    ReservationCode = reservation.ReservationCode,
                    CustomerId = reservation.CustomerId,
                    CustomerFullName = reservation.Customer.FirstName + " " + reservation.Customer.LastName,
                    CustomerEmail = reservation.Customer.Email,
                    PitchId = reservation.PitchId,
                    PitchNumber = reservation.Pitch.PitchNumber,
                    PitchName = reservation.Pitch.PitchName,
                    CheckInDate = reservation.CheckInDate,
                    CheckOutDate = reservation.CheckOutDate,
                    AdultsCount = reservation.AdultsCount,
                    ChildrenCount = reservation.ChildrenCount,
                    PetsCount = reservation.PetsCount,
                    CampingEquipmentTypeId = reservation.CampingEquipmentTypeId,
                    CampingEquipmentTypeCode = reservation.CampingEquipmentType.Code,
                    CampingEquipmentTypeName = reservation.CampingEquipmentType.Name,
                    VehiclePlate = reservation.VehiclePlate,
                    Status = reservation.Status,
                    Notes = reservation.Notes,
                    CreatedAt = reservation.CreatedAt,
                    UpdatedAt = reservation.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceResult<ReservationDto>> CreateAsync(CreateReservationDto dto)
        {
            var validation = await ValidateReservationAsync(
                dto.ReservationCode,
                dto.CustomerId,
                dto.PitchId,
                dto.CampingEquipmentTypeId,
                dto.CheckInDate,
                dto.CheckOutDate,
                dto.Status,
                null);

            if (!validation.Succeeded)
            {
                return ServiceResult<ReservationDto>.Failure(
                    validation.ErrorType!.Value,
                    validation.ErrorMessage!);
            }

            var now = DateTime.UtcNow;
            var reservation = new Reservation
            {
                ReservationCode = NormalizeCode(dto.ReservationCode),
                CustomerId = dto.CustomerId,
                PitchId = dto.PitchId,
                CheckInDate = dto.CheckInDate.Date,
                CheckOutDate = dto.CheckOutDate.Date,
                AdultsCount = dto.AdultsCount,
                ChildrenCount = dto.ChildrenCount,
                PetsCount = dto.PetsCount,
                CampingEquipmentTypeId = dto.CampingEquipmentTypeId,
                VehiclePlate = NormalizeOptional(dto.VehiclePlate),
                Status = dto.Status,
                Notes = NormalizeOptional(dto.Notes),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Reservations.Add(reservation);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A reservation with code '{reservation.ReservationCode}' already exists.");
            }

            var created = await GetByIdAsync(reservation.Id);

            return ServiceResult<ReservationDto>.Success(created!);
        }

        public async Task<ServiceResult<ReservationDto>> UpdateAsync(int id, UpdateReservationDto dto)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation is null)
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.NotFound,
                    "Reservation not found.");
            }

            var targetStatus = dto.Status!.Value;

            if (reservation.Status != targetStatus && !CanTransition(reservation.Status, targetStatus))
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.Validation,
                    $"Reservation cannot move from {reservation.Status} to {targetStatus}.");
            }

            var validation = await ValidateReservationAsync(
                dto.ReservationCode,
                dto.CustomerId,
                dto.PitchId,
                dto.CampingEquipmentTypeId,
                dto.CheckInDate,
                dto.CheckOutDate,
                targetStatus,
                id);

            if (!validation.Succeeded)
            {
                return ServiceResult<ReservationDto>.Failure(
                    validation.ErrorType!.Value,
                    validation.ErrorMessage!);
            }

            reservation.ReservationCode = NormalizeCode(dto.ReservationCode);
            reservation.CustomerId = dto.CustomerId;
            reservation.PitchId = dto.PitchId;
            reservation.CheckInDate = dto.CheckInDate.Date;
            reservation.CheckOutDate = dto.CheckOutDate.Date;
            reservation.AdultsCount = dto.AdultsCount;
            reservation.ChildrenCount = dto.ChildrenCount;
            reservation.PetsCount = dto.PetsCount;
            reservation.CampingEquipmentTypeId = dto.CampingEquipmentTypeId;
            reservation.VehiclePlate = NormalizeOptional(dto.VehiclePlate);
            reservation.Status = targetStatus;
            reservation.Notes = NormalizeOptional(dto.Notes);
            reservation.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A reservation with code '{reservation.ReservationCode}' already exists.");
            }

            var updated = await GetByIdAsync(id);

            return ServiceResult<ReservationDto>.Success(updated!);
        }

        public async Task<ServiceResult<ReservationDto>> ChangeStatusAsync(int id, ChangeReservationStatusDto dto)
        {
            if (!dto.Status.HasValue || !Enum.IsDefined(dto.Status.Value))
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.Validation,
                    "Reservation status is not valid.");
            }

            return await ChangeStatusAsync(id, dto.Status.Value);
        }

        public Task<ServiceResult<ReservationDto>> ConfirmAsync(int id)
        {
            return ChangeStatusAsync(id, ReservationStatus.Confirmed);
        }

        public Task<ServiceResult<ReservationDto>> CheckInAsync(int id)
        {
            return ChangeStatusAsync(id, ReservationStatus.CheckedIn);
        }

        public Task<ServiceResult<ReservationDto>> CheckOutAsync(int id)
        {
            return ChangeStatusAsync(id, ReservationStatus.CheckedOut);
        }

        public Task<ServiceResult<ReservationDto>> CancelAsync(int id)
        {
            return ChangeStatusAsync(id, ReservationStatus.Cancelled);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation is null)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Reservation not found.");
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return ServiceResult<bool>.Success(true);
        }

        private async Task<ServiceResult<ReservationDto>> ChangeStatusAsync(int id, ReservationStatus targetStatus)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation is null)
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.NotFound,
                    "Reservation not found.");
            }

            if (reservation.Status == targetStatus)
            {
                var unchanged = await GetByIdAsync(id);

                return ServiceResult<ReservationDto>.Success(unchanged!);
            }

            if (!CanTransition(reservation.Status, targetStatus))
            {
                return ServiceResult<ReservationDto>.Failure(
                    ServiceErrorType.Validation,
                    $"Reservation cannot move from {reservation.Status} to {targetStatus}.");
            }

            if (BlockingStatuses.Contains(targetStatus))
            {
                var overlaps = await HasOverlappingReservationAsync(
                    reservation.PitchId,
                    reservation.CheckInDate,
                    reservation.CheckOutDate,
                    reservation.Id);

                if (overlaps)
                {
                    return ServiceResult<ReservationDto>.Failure(
                        ServiceErrorType.Conflict,
                        "The selected pitch is already reserved for the requested dates.");
                }
            }

            reservation.Status = targetStatus;
            reservation.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updated = await GetByIdAsync(id);

            return ServiceResult<ReservationDto>.Success(updated!);
        }

        private async Task<ServiceResult<bool>> ValidateReservationAsync(
            string reservationCode,
            int customerId,
            int pitchId,
            int campingEquipmentTypeId,
            DateTime checkInDate,
            DateTime checkOutDate,
            ReservationStatus status,
            int? reservationIdToExclude)
        {
            if (!Enum.IsDefined(status))
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Validation,
                    "Reservation status is not valid.");
            }

            if (string.IsNullOrWhiteSpace(reservationCode))
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Validation,
                    "ReservationCode cannot be empty.");
            }

            var normalizedReservationCode = NormalizeCode(reservationCode);

            var duplicateCodeExists = await _context.Reservations
                .AnyAsync(reservation =>
                    reservation.Id != reservationIdToExclude &&
                    reservation.ReservationCode == normalizedReservationCode);

            if (duplicateCodeExists)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Conflict,
                    $"A reservation with code '{normalizedReservationCode}' already exists.");
            }

            var normalizedCheckInDate = checkInDate.Date;
            var normalizedCheckOutDate = checkOutDate.Date;

            if (normalizedCheckInDate >= normalizedCheckOutDate)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Validation,
                    "Check-out date must be after check-in date.");
            }

            if (normalizedCheckInDate < DateTime.UtcNow.Date)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Validation,
                    "Check-in date cannot be in the past.");
            }

            var customerExists = await _context.Customers
                .AnyAsync(customer => customer.Id == customerId);

            if (!customerExists)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Customer not found.");
            }

            var pitch = await _context.Pitches
                .AsNoTracking()
                .FirstOrDefaultAsync(existingPitch => existingPitch.Id == pitchId);

            if (pitch is null)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Pitch not found.");
            }

            if (!pitch.IsActive)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Validation,
                    "Pitch is not active.");
            }

            var campingEquipmentType = await _context.CampingEquipmentTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(existingType => existingType.Id == campingEquipmentTypeId);

            if (campingEquipmentType is null)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Camping equipment type not found.");
            }

            if (!campingEquipmentType.IsActive)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Validation,
                    "Camping equipment type is not active.");
            }

            if (BlockingStatuses.Contains(status))
            {
                var overlaps = await HasOverlappingReservationAsync(
                    pitchId,
                    normalizedCheckInDate,
                    normalizedCheckOutDate,
                    reservationIdToExclude);

                if (overlaps)
                {
                    return ServiceResult<bool>.Failure(
                        ServiceErrorType.Conflict,
                        "The selected pitch is already reserved for the requested dates.");
                }
            }

            return ServiceResult<bool>.Success(true);
        }

        private async Task<bool> HasOverlappingReservationAsync(
            int pitchId,
            DateTime checkInDate,
            DateTime checkOutDate,
            int? reservationIdToExclude)
        {
            return await _context.Reservations
                .AnyAsync(reservation =>
                    reservation.Id != reservationIdToExclude &&
                    reservation.PitchId == pitchId &&
                    BlockingStatuses.Contains(reservation.Status) &&
                    reservation.CheckInDate < checkOutDate &&
                    checkInDate < reservation.CheckOutDate);
        }

        private static bool CanTransition(ReservationStatus currentStatus, ReservationStatus targetStatus)
        {
            return currentStatus switch
            {
                ReservationStatus.Pending =>
                    targetStatus is ReservationStatus.Confirmed or ReservationStatus.Cancelled or ReservationStatus.NoShow,

                ReservationStatus.Confirmed =>
                    targetStatus is ReservationStatus.CheckedIn or ReservationStatus.Cancelled or ReservationStatus.NoShow,

                ReservationStatus.CheckedIn =>
                    targetStatus is ReservationStatus.CheckedOut,

                ReservationStatus.CheckedOut => false,
                ReservationStatus.Cancelled => false,
                ReservationStatus.NoShow => false,
                _ => false
            };
        }

        private static string NormalizeCode(string code)
        {
            return code.Trim().ToUpperInvariant();
        }

        private static string? NormalizeOptional(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
    }
}
