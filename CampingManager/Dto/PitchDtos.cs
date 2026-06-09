using System.ComponentModel.DataAnnotations;

namespace CampingManager.Dto
{
    public class PitchQueryDto : PagedQueryDto
    {
        public bool? IsActive { get; set; }

        [StringLength(100)]
        public string? Search { get; set; }
    }

    public class PitchDto
    {
        public int Id { get; set; }
        public required string PitchNumber { get; set; }
        public required string PitchName { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreatePitchDto
    {
        [Required]
        [MinLength(1)]
        [StringLength(20)]
        [RegularExpression("^[A-Za-z0-9-]+$")]
        public required string PitchNumber { get; set; }

        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string PitchName { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class UpdatePitchDto
    {
        [Required]
        [MinLength(1)]
        [StringLength(20)]
        [RegularExpression("^[A-Za-z0-9-]+$")]
        public required string PitchNumber { get; set; }

        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string PitchName { get; set; }

        public bool IsActive { get; set; }
    }
}
