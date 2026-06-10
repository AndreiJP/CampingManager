using System.ComponentModel.DataAnnotations;

namespace CampingManager.Options
{
    public class AdminBootstrapOptions
    {
        public bool Enabled { get; set; }

        [StringLength(200, MinimumLength = 16)]
        public string? SetupToken { get; set; }
    }
}
