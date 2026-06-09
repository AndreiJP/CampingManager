namespace CampingManager.Models
{
    public class Pitch
    {
        public int Id { get; set; }
        public required string PitchNumber { get; set; }
        public required string PitchName { get; set; }
        public bool IsActive { get; set; }
    }
}
