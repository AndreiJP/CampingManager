using CampingManager.Data;
using CampingManager.Dto;
using CampingManager.Interfaces;
using CampingManager.Models;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Services
{
    public class PitchService : IPitchService
    {
        private readonly AppDbContext _context;

        public PitchService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<PitchDto>> GetAllAsync(PitchQueryDto queryDto)
        {
            var query = _context.Pitches.AsNoTracking();

            if (queryDto.IsActive.HasValue)
            {
                query = query.Where(pitch => pitch.IsActive == queryDto.IsActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryDto.Search))
            {
                var searchPattern = $"%{queryDto.Search.Trim()}%";

                query = query.Where(pitch =>
                    EF.Functions.Like(pitch.PitchNumber, searchPattern) ||
                    EF.Functions.Like(pitch.PitchName, searchPattern));
            }

            return await query
                .OrderBy(pitch => pitch.PitchNumber)
                .Select(pitch => new PitchDto
                {
                    Id = pitch.Id,
                    PitchNumber = pitch.PitchNumber,
                    PitchName = pitch.PitchName,
                    IsActive = pitch.IsActive
                })
                .ToPagedResultAsync(queryDto.PageNumber, queryDto.PageSize);
        }

        public async Task<PitchDto?> GetByIdAsync(int id)
        {
            return await _context.Pitches
                .AsNoTracking()
                .Where(pitch => pitch.Id == id)
                .Select(pitch => new PitchDto
                {
                    Id = pitch.Id,
                    PitchNumber = pitch.PitchNumber,
                    PitchName = pitch.PitchName,
                    IsActive = pitch.IsActive
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceResult<PitchDto>> CreateAsync(CreatePitchDto dto)
        {
            var validationError = ValidatePitchInput(dto.PitchNumber, dto.PitchName);

            if (validationError is not null)
            {
                return ServiceResult<PitchDto>.Failure(ServiceErrorType.Validation, validationError);
            }

            var pitchNumber = NormalizePitchNumber(dto.PitchNumber);

            var exists = await _context.Pitches
                .AnyAsync(pitch => pitch.PitchNumber == pitchNumber);

            if (exists)
            {
                return ServiceResult<PitchDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A pitch with number '{pitchNumber}' already exists.");
            }

            var pitch = new Pitch
            {
                PitchNumber = pitchNumber,
                PitchName = dto.PitchName.Trim(),
                IsActive = dto.IsActive
            };

            _context.Pitches.Add(pitch);
            await _context.SaveChangesAsync();

            return ServiceResult<PitchDto>.Success(ToDto(pitch));
        }

        public async Task<ServiceResult<PitchDto>> UpdateAsync(int id, UpdatePitchDto dto)
        {
            var pitch = await _context.Pitches.FindAsync(id);

            if (pitch is null)
            {
                return ServiceResult<PitchDto>.Failure(
                    ServiceErrorType.NotFound,
                    "Pitch not found.");
            }

            var pitchNumber = NormalizePitchNumber(dto.PitchNumber);

            var validationError = ValidatePitchInput(dto.PitchNumber, dto.PitchName);

            if (validationError is not null)
            {
                return ServiceResult<PitchDto>.Failure(ServiceErrorType.Validation, validationError);
            }

            var exists = await _context.Pitches
                .AnyAsync(existingPitch =>
                    existingPitch.Id != id &&
                    existingPitch.PitchNumber == pitchNumber);

            if (exists)
            {
                return ServiceResult<PitchDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A pitch with number '{pitchNumber}' already exists.");
            }

            if (!dto.IsActive)
            {
                var hasActiveReservations = await _context.Reservations
                    .AnyAsync(reservation =>
                        reservation.PitchId == id &&
                        (reservation.Status == ReservationStatus.Pending ||
                         reservation.Status == ReservationStatus.Confirmed ||
                         reservation.Status == ReservationStatus.CheckedIn));

                if (hasActiveReservations)
                {
                    return ServiceResult<PitchDto>.Failure(
                        ServiceErrorType.Conflict,
                        "This pitch cannot be deactivated because it has active reservations.");
                }
            }

            pitch.PitchNumber = pitchNumber;
            pitch.PitchName = dto.PitchName.Trim();
            pitch.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return ServiceResult<PitchDto>.Success(ToDto(pitch));
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            var pitch = await _context.Pitches.FindAsync(id);

            if (pitch is null)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Pitch not found.");
            }

            var hasReservations = await _context.Reservations
                .AnyAsync(reservation => reservation.PitchId == id);

            if (hasReservations)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Conflict,
                    "This pitch cannot be deleted because it is used by one or more reservations.");
            }

            _context.Pitches.Remove(pitch);
            await _context.SaveChangesAsync();

            return ServiceResult<bool>.Success(true);
        }

        private static PitchDto ToDto(Pitch pitch)
        {
            return new PitchDto
            {
                Id = pitch.Id,
                PitchNumber = pitch.PitchNumber,
                PitchName = pitch.PitchName,
                IsActive = pitch.IsActive
            };
        }

        private static string NormalizePitchNumber(string pitchNumber)
        {
            return pitchNumber.Trim().ToUpperInvariant();
        }

        private static string? ValidatePitchInput(string pitchNumber, string pitchName)
        {
            if (string.IsNullOrWhiteSpace(pitchNumber))
            {
                return "PitchNumber cannot be empty.";
            }

            if (string.IsNullOrWhiteSpace(pitchName))
            {
                return "PitchName cannot be empty.";
            }

            return null;
        }
    }
}
