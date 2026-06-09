using System.ComponentModel.DataAnnotations;

namespace CampingManager.Options
{
    public class JwtSettings
    {
        [Required]
        public required string Issuer { get; set; }

        [Required]
        public required string Audience { get; set; }

        [Required]
        [MinLength(32)]
        public required string SecretKey { get; set; }

        [Range(5, 1440)]
        public int ExpiresMinutes { get; set; } = 120;
    }
}
