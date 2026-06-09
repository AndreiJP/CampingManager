namespace CampingManager.Models
{
    public class CampingEquipmentType
    {
        public int Id { get; set; }
        public required string Code { get; set; }
        public required string Name { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
