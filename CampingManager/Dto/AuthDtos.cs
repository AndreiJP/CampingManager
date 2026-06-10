using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CampingManager.Dto
{
    public class BootstrapAdminDto
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public required string Email { get; set; }

        [Required]
        [MinLength(8)]
        [StringLength(100)]
        public required string Password { get; set; }
    }

    public class AdminLoginDto
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public required string Email { get; set; }

        [Required]
        [StringLength(100)]
        public required string Password { get; set; }
    }

    public class AdminUserDto
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Role { get; set; }
        public bool IsActive { get; set; }
    }

    public class AuthResponseDto
    {
        [JsonIgnore]
        public string AccessToken { get; set; } = string.Empty;

        public string TokenType { get; set; } = "Bearer";
        public DateTime ExpiresAt { get; set; }
        public required AdminUserDto User { get; set; }
    }
}
