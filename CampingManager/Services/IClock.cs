namespace CampingManager.Services
{
    public interface IClock
    {
        DateTime UtcNow { get; }
        DateTime UtcToday { get; }
    }
}
