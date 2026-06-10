using CampingManager.Data;
using CampingManager.Dto;
using CampingManager.Interfaces;
using CampingManager.Models;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Services
{
    public class CampingEquipmentTypeService : ICampingEquipmentTypeService
    {
        private readonly AppDbContext _context;

        public CampingEquipmentTypeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<CampingEquipmentTypeDto>> GetAllAsync(CampingEquipmentTypeQueryDto queryDto)
        {
            var query = _context.CampingEquipmentTypes.AsNoTracking();

            if (queryDto.IsActive.HasValue)
            {
                query = query.Where(equipmentType => equipmentType.IsActive == queryDto.IsActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryDto.Search))
            {
                var searchPattern = $"%{queryDto.Search.Trim()}%";

                query = query.Where(equipmentType =>
                    EF.Functions.Like(equipmentType.Code, searchPattern) ||
                    EF.Functions.Like(equipmentType.Name, searchPattern));
            }

            return await query
                .OrderBy(equipmentType => equipmentType.Code)
                .Select(equipmentType => new CampingEquipmentTypeDto
                {
                    Id = equipmentType.Id,
                    Code = equipmentType.Code,
                    Name = equipmentType.Name,
                    IsActive = equipmentType.IsActive,
                    CreatedAt = equipmentType.CreatedAt,
                    UpdatedAt = equipmentType.UpdatedAt
                })
                .ToPagedResultAsync(queryDto.PageNumber, queryDto.PageSize);
        }

        public async Task<CampingEquipmentTypeDto?> GetByIdAsync(int id)
        {
            return await _context.CampingEquipmentTypes
                .AsNoTracking()
                .Where(equipmentType => equipmentType.Id == id)
                .Select(equipmentType => new CampingEquipmentTypeDto
                {
                    Id = equipmentType.Id,
                    Code = equipmentType.Code,
                    Name = equipmentType.Name,
                    IsActive = equipmentType.IsActive,
                    CreatedAt = equipmentType.CreatedAt,
                    UpdatedAt = equipmentType.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceResult<CampingEquipmentTypeDto>> CreateAsync(CreateCampingEquipmentTypeDto dto)
        {
            var validationError = ValidateEquipmentTypeInput(dto.Code, dto.Name);

            if (validationError is not null)
            {
                return ServiceResult<CampingEquipmentTypeDto>.Failure(ServiceErrorType.Validation, validationError);
            }

            var code = NormalizeCode(dto.Code);

            var exists = await _context.CampingEquipmentTypes
                .AnyAsync(equipmentType => equipmentType.Code == code);

            if (exists)
            {
                return ServiceResult<CampingEquipmentTypeDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"An equipment type with code '{code}' already exists.");
            }

            var now = DateTime.UtcNow;
            var equipmentType = new CampingEquipmentType
            {
                Code = code,
                Name = dto.Name.Trim(),
                IsActive = dto.IsActive,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.CampingEquipmentTypes.Add(equipmentType);
            await _context.SaveChangesAsync();

            return ServiceResult<CampingEquipmentTypeDto>.Success(ToDto(equipmentType));
        }

        public async Task<ServiceResult<CampingEquipmentTypeDto>> UpdateAsync(int id, UpdateCampingEquipmentTypeDto dto)
        {
            var equipmentType = await _context.CampingEquipmentTypes.FindAsync(id);

            if (equipmentType is null)
            {
                return ServiceResult<CampingEquipmentTypeDto>.Failure(
                    ServiceErrorType.NotFound,
                    "Camping equipment type not found.");
            }

            var code = NormalizeCode(dto.Code);

            var validationError = ValidateEquipmentTypeInput(dto.Code, dto.Name);

            if (validationError is not null)
            {
                return ServiceResult<CampingEquipmentTypeDto>.Failure(ServiceErrorType.Validation, validationError);
            }

            var exists = await _context.CampingEquipmentTypes
                .AnyAsync(existingEquipmentType =>
                    existingEquipmentType.Id != id &&
                    existingEquipmentType.Code == code);

            if (exists)
            {
                return ServiceResult<CampingEquipmentTypeDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"An equipment type with code '{code}' already exists.");
            }

            if (!dto.IsActive)
            {
                var hasActiveReservations = await _context.Reservations
                    .AnyAsync(reservation =>
                        reservation.CampingEquipmentTypeId == id &&
                        (reservation.Status == ReservationStatus.Pending ||
                         reservation.Status == ReservationStatus.Confirmed ||
                         reservation.Status == ReservationStatus.CheckedIn));

                if (hasActiveReservations)
                {
                    return ServiceResult<CampingEquipmentTypeDto>.Failure(
                        ServiceErrorType.Conflict,
                        "This equipment type cannot be deactivated because it has active reservations.");
                }
            }

            equipmentType.Code = code;
            equipmentType.Name = dto.Name.Trim();
            equipmentType.IsActive = dto.IsActive;
            equipmentType.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ServiceResult<CampingEquipmentTypeDto>.Success(ToDto(equipmentType));
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            var equipmentType = await _context.CampingEquipmentTypes.FindAsync(id);

            if (equipmentType is null)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Camping equipment type not found.");
            }

            var hasReservations = await _context.Reservations
                .AnyAsync(reservation => reservation.CampingEquipmentTypeId == id);

            if (hasReservations)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Conflict,
                    "This equipment type cannot be deleted because it is used by one or more reservations.");
            }

            _context.CampingEquipmentTypes.Remove(equipmentType);
            await _context.SaveChangesAsync();

            return ServiceResult<bool>.Success(true);
        }

        private static CampingEquipmentTypeDto ToDto(CampingEquipmentType equipmentType)
        {
            return new CampingEquipmentTypeDto
            {
                Id = equipmentType.Id,
                Code = equipmentType.Code,
                Name = equipmentType.Name,
                IsActive = equipmentType.IsActive,
                CreatedAt = equipmentType.CreatedAt,
                UpdatedAt = equipmentType.UpdatedAt
            };
        }

        private static string NormalizeCode(string code)
        {
            return code.Trim().ToUpperInvariant();
        }

        private static string? ValidateEquipmentTypeInput(string code, string name)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return "Code cannot be empty.";
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                return "Name cannot be empty.";
            }

            return null;
        }
    }
}
