using System.ComponentModel.DataAnnotations;

namespace CampingManager.Dto
{
    public class CampingEquipmentTypeQueryDto : PagedQueryDto
    {
        public bool? IsActive { get; set; }

        [StringLength(100)]
        public string? Search { get; set; }
    }

    public class CampingEquipmentTypeDto
    {
        public int Id { get; set; }
        public required string Code { get; set; }
        public required string Name { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateCampingEquipmentTypeDto
    {
        [Required]
        [MinLength(1)]
        [StringLength(30)]
        [RegularExpression("^[A-Za-z0-9-]+$")]
        public required string Code { get; set; }

        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string Name { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class UpdateCampingEquipmentTypeDto
    {
        [Required]
        [MinLength(1)]
        [StringLength(30)]
        [RegularExpression("^[A-Za-z0-9-]+$")]
        public required string Code { get; set; }

        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string Name { get; set; }

        public bool IsActive { get; set; }
    }
}
