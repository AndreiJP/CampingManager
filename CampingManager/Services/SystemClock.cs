namespace CampingManager.Services
{
    public sealed class SystemClock : IClock
    {
        public DateTime UtcNow => DateTime.UtcNow;
        public DateTime UtcToday => UtcNow.Date;
    }
}
