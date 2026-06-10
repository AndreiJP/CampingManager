namespace CampingManager.Models
{
    public class PitchOccupancy
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;
        public int PitchId { get; set; }
        public Pitch Pitch { get; set; } = null!;
        public DateTime OccupancyDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
