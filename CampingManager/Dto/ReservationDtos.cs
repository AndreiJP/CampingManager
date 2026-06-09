using System.ComponentModel.DataAnnotations;
using CampingManager.Models;

namespace CampingManager.Dto
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public required string ReservationCode { get; set; }
        public int CustomerId { get; set; }
        public required string CustomerFullName { get; set; }
        public required string CustomerEmail { get; set; }
        public int PitchId { get; set; }
        public required string PitchNumber { get; set; }
        public required string PitchName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int AdultsCount { get; set; }
        public int ChildrenCount { get; set; }
        public int PetsCount { get; set; }
        public int CampingEquipmentTypeId { get; set; }
        public required string CampingEquipmentTypeCode { get; set; }
        public required string CampingEquipmentTypeName { get; set; }
        public string? VehiclePlate { get; set; }
        public ReservationStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ReservationQueryDto : PagedQueryDto, IValidatableObject
    {
        public int? CustomerId { get; set; }
        public int? PitchId { get; set; }
        public ReservationStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        [StringLength(100)]
        public string? Search { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (FromDate.HasValue && ToDate.HasValue && FromDate.Value.Date >= ToDate.Value.Date)
            {
                yield return new ValidationResult(
                    "ToDate must be after FromDate.",
                    [nameof(ToDate)]);
            }
        }
    }

    public class ReservationAvailabilityQueryDto : IValidatableObject
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int? ExcludeReservationId { get; set; }
        public bool IncludeUnavailable { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (FromDate == default)
            {
                yield return new ValidationResult(
                    "FromDate is required.",
                    [nameof(FromDate)]);
            }

            if (ToDate == default)
            {
                yield return new ValidationResult(
                    "ToDate is required.",
                    [nameof(ToDate)]);
            }

            if (FromDate != default && ToDate != default && FromDate.Date >= ToDate.Date)
            {
                yield return new ValidationResult(
                    "ToDate must be after FromDate.",
                    [nameof(ToDate)]);
            }
        }
    }

    public class PitchAvailabilityDto
    {
        public int PitchId { get; set; }
        public required string PitchNumber { get; set; }
        public required string PitchName { get; set; }
        public bool IsAvailable { get; set; }
        public IReadOnlyList<string> BlockingReservationCodes { get; set; } = [];
    }

    public class ChangeReservationStatusDto
    {
        [Required]
        public ReservationStatus? Status { get; set; }
    }

    public class CreateReservationDto : IValidatableObject
    {
        [Required]
        [MinLength(3)]
        [StringLength(30)]
        [RegularExpression("^[A-Za-z0-9-]+$")]
        public required string ReservationCode { get; set; }

        [Range(1, int.MaxValue)]
        public int CustomerId { get; set; }

        [Range(1, int.MaxValue)]
        public int PitchId { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        [Range(1, 50)]
        public int AdultsCount { get; set; } = 1;

        [Range(0, 50)]
        public int ChildrenCount { get; set; }

        [Range(0, 20)]
        public int PetsCount { get; set; }

        [Range(1, int.MaxValue)]
        public int CampingEquipmentTypeId { get; set; }

        [StringLength(20)]
        [RegularExpression("^[A-Za-z0-9 -]+$")]
        public string? VehiclePlate { get; set; }

        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

        [StringLength(1000)]
        public string? Notes { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            foreach (var validationResult in ReservationDtoValidation.ValidateDateRange(CheckInDate, CheckOutDate))
            {
                yield return validationResult;
            }
        }
    }

    public class UpdateReservationDto : IValidatableObject
    {
        [Required]
        [MinLength(3)]
        [StringLength(30)]
        [RegularExpression("^[A-Za-z0-9-]+$")]
        public required string ReservationCode { get; set; }

        [Range(1, int.MaxValue)]
        public int CustomerId { get; set; }

        [Range(1, int.MaxValue)]
        public int PitchId { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        [Range(1, 50)]
        public int AdultsCount { get; set; }

        [Range(0, 50)]
        public int ChildrenCount { get; set; }

        [Range(0, 20)]
        public int PetsCount { get; set; }

        [Range(1, int.MaxValue)]
        public int CampingEquipmentTypeId { get; set; }

        [StringLength(20)]
        [RegularExpression("^[A-Za-z0-9 -]+$")]
        public string? VehiclePlate { get; set; }

        [Required]
        public ReservationStatus? Status { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            foreach (var validationResult in ReservationDtoValidation.ValidateDateRange(CheckInDate, CheckOutDate))
            {
                yield return validationResult;
            }
        }
    }

    internal static class ReservationDtoValidation
    {
        public static IEnumerable<ValidationResult> ValidateDateRange(DateTime checkInDate, DateTime checkOutDate)
        {
            if (checkInDate == default)
            {
                yield return new ValidationResult(
                    "CheckInDate is required.",
                    [nameof(CreateReservationDto.CheckInDate)]);
            }

            if (checkOutDate == default)
            {
                yield return new ValidationResult(
                    "CheckOutDate is required.",
                    [nameof(CreateReservationDto.CheckOutDate)]);
            }

            if (checkInDate != default && checkOutDate != default && checkInDate.Date >= checkOutDate.Date)
            {
                yield return new ValidationResult(
                    "CheckOutDate must be after CheckInDate.",
                    [nameof(CreateReservationDto.CheckOutDate)]);
            }
        }
    }
}
