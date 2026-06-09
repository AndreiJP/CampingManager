using System.ComponentModel.DataAnnotations;

namespace CampingManager.Dto
{
    public class CustomerQueryDto : PagedQueryDto
    {
        [StringLength(100)]
        public string? Search { get; set; }
    }

    public class CustomerDto
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateCustomerDto
    {
        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string FirstName { get; set; }

        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string LastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public required string Email { get; set; }

        [StringLength(30)]
        [Phone]
        public string? PhoneNumber { get; set; }
    }

    public class UpdateCustomerDto
    {
        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string FirstName { get; set; }

        [Required]
        [MinLength(1)]
        [StringLength(100)]
        public required string LastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public required string Email { get; set; }

        [StringLength(30)]
        [Phone]
        public string? PhoneNumber { get; set; }
    }
}
