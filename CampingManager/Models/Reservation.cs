namespace CampingManager.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public required string ReservationCode { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public int PitchId { get; set; }
        public Pitch Pitch { get; set; } = null!;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int AdultsCount { get; set; }
        public int ChildrenCount { get; set; }
        public int PetsCount { get; set; }
        public int CampingEquipmentTypeId { get; set; }
        public CampingEquipmentType CampingEquipmentType { get; set; } = null!;
        public string? VehiclePlate { get; set; }
        public ReservationStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<PitchOccupancy> PitchOccupancies { get; set; } = [];
    }
}
