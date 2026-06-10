using CampingManager.Data;
using CampingManager.Models;
using CampingManager.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Tests;

internal sealed class ServiceTestHarness : IDisposable
{
    private readonly SqliteConnection _connection;

    private ServiceTestHarness(SqliteConnection connection, AppDbContext context, FixedClock clock)
    {
        _connection = connection;
        Context = context;
        Clock = clock;
    }

    public AppDbContext Context { get; }
    public FixedClock Clock { get; }

    public static async Task<ServiceTestHarness> CreateAsync()
    {
        var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new AppDbContext(options);
        await context.Database.EnsureCreatedAsync();

        return new ServiceTestHarness(connection, context, new FixedClock());
    }

    public async Task<SeedData> SeedReservationLookupsAsync()
    {
        var customer = new Customer
        {
            FirstName = "Mario",
            LastName = "Rossi",
            Email = "mario.rossi@example.test",
            CreatedAt = Clock.UtcNow,
            UpdatedAt = Clock.UtcNow
        };

        var pitch = new Pitch
        {
            PitchNumber = "A1",
            PitchName = "Piazzola A1",
            IsActive = true
        };

        var equipmentType = new CampingEquipmentType
        {
            Code = "TENT",
            Name = "Tenda",
            IsActive = true,
            CreatedAt = Clock.UtcNow,
            UpdatedAt = Clock.UtcNow
        };

        Context.AddRange(customer, pitch, equipmentType);
        await Context.SaveChangesAsync();

        return new SeedData(customer.Id, pitch.Id, equipmentType.Id);
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}

internal sealed class FixedClock : IClock
{
    public DateTime UtcNow { get; set; } = new(2026, 6, 9, 12, 0, 0, DateTimeKind.Utc);
    public DateTime UtcToday => UtcNow.Date;
}

internal sealed record SeedData(int CustomerId, int PitchId, int EquipmentTypeId);
