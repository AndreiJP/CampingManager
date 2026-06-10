using CampingManager.Models;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Reservation> Reservations => Set<Reservation>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Pitch> Pitches => Set<Pitch>();
        public DbSet<CampingEquipmentType> CampingEquipmentTypes => Set<CampingEquipmentType>();
        public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
        public DbSet<AppLock> AppLocks => Set<AppLock>();
        public DbSet<PitchOccupancy> PitchOccupancies => Set<PitchOccupancy>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(customer => customer.FirstName)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(customer => customer.LastName)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(customer => customer.Email)
                    .HasMaxLength(255)
                    .IsRequired();

                entity.HasIndex(customer => customer.Email)
                    .IsUnique();

                entity.Property(customer => customer.PhoneNumber)
                    .HasMaxLength(30);

                entity.Property(customer => customer.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(customer => customer.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<AdminUser>(entity =>
            {
                entity.Property(adminUser => adminUser.Email)
                    .HasMaxLength(255)
                    .IsRequired();

                entity.HasIndex(adminUser => adminUser.Email)
                    .IsUnique();

                entity.Property(adminUser => adminUser.PasswordHash)
                    .HasMaxLength(500)
                    .IsRequired();

                entity.Property(adminUser => adminUser.Role)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(adminUser => adminUser.IsActive)
                    .HasDefaultValue(true);

                entity.Property(adminUser => adminUser.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(adminUser => adminUser.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<AppLock>(entity =>
            {
                entity.HasKey(appLock => appLock.Key);

                entity.Property(appLock => appLock.Key)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(appLock => appLock.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<Pitch>(entity =>
            {
                entity.Property(pitch => pitch.PitchNumber)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.HasIndex(pitch => pitch.PitchNumber)
                    .IsUnique();

                entity.Property(pitch => pitch.PitchName)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(pitch => pitch.IsActive)
                    .HasDefaultValue(true);
            });

            modelBuilder.Entity<CampingEquipmentType>(entity =>
            {
                entity.Property(equipmentType => equipmentType.Code)
                    .HasMaxLength(30)
                    .IsRequired();

                entity.HasIndex(equipmentType => equipmentType.Code)
                    .IsUnique();

                entity.Property(equipmentType => equipmentType.Name)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(equipmentType => equipmentType.IsActive)
                    .HasDefaultValue(true);

                entity.Property(equipmentType => equipmentType.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(equipmentType => equipmentType.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.Property(reservation => reservation.ReservationCode)
                    .HasMaxLength(30)
                    .IsRequired();

                entity.HasIndex(reservation => reservation.ReservationCode)
                    .IsUnique();

                entity.Property(reservation => reservation.VehiclePlate)
                    .HasMaxLength(20);

                entity.Property(reservation => reservation.Notes)
                    .HasMaxLength(1000);

                entity.Property(reservation => reservation.Status)
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(reservation => reservation.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(reservation => reservation.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(reservation => reservation.Customer)
                    .WithMany()
                    .HasForeignKey(reservation => reservation.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(reservation => reservation.Pitch)
                    .WithMany()
                    .HasForeignKey(reservation => reservation.PitchId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(reservation => reservation.CampingEquipmentType)
                    .WithMany()
                    .HasForeignKey(reservation => reservation.CampingEquipmentTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PitchOccupancy>(entity =>
            {
                entity.Property(occupancy => occupancy.OccupancyDate)
                    .IsRequired();

                entity.Property(occupancy => occupancy.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(occupancy => new { occupancy.PitchId, occupancy.OccupancyDate })
                    .IsUnique();

                entity.HasIndex(occupancy => occupancy.ReservationId);

                entity.HasOne(occupancy => occupancy.Reservation)
                    .WithMany(reservation => reservation.PitchOccupancies)
                    .HasForeignKey(occupancy => occupancy.ReservationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(occupancy => occupancy.Pitch)
                    .WithMany()
                    .HasForeignKey(occupancy => occupancy.PitchId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
