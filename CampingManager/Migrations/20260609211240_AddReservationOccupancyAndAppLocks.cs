using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampingManager.Migrations
{
    /// <inheritdoc />
    public partial class AddReservationOccupancyAndAppLocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppLocks",
                columns: table => new
                {
                    Key = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLocks", x => x.Key);
                });

            migrationBuilder.CreateTable(
                name: "PitchOccupancies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ReservationId = table.Column<int>(type: "INTEGER", nullable: false),
                    PitchId = table.Column<int>(type: "INTEGER", nullable: false),
                    OccupancyDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PitchOccupancies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PitchOccupancies_Pitches_PitchId",
                        column: x => x.PitchId,
                        principalTable: "Pitches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PitchOccupancies_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql("""
                INSERT INTO PitchOccupancies (ReservationId, PitchId, OccupancyDate, CreatedAt)
                WITH RECURSIVE OccupiedDates(ReservationId, PitchId, OccupancyDate, CheckOutDate) AS
                (
                    SELECT Id, PitchId, date(CheckInDate), date(CheckOutDate)
                    FROM Reservations
                    WHERE Status IN ('Pending', 'Confirmed', 'CheckedIn')
                        AND date(CheckInDate) < date(CheckOutDate)

                    UNION ALL

                    SELECT ReservationId, PitchId, date(OccupancyDate, '+1 day'), CheckOutDate
                    FROM OccupiedDates
                    WHERE date(OccupancyDate, '+1 day') < CheckOutDate
                )
                SELECT ReservationId, PitchId, OccupancyDate, CURRENT_TIMESTAMP
                FROM OccupiedDates;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_PitchOccupancies_PitchId_OccupancyDate",
                table: "PitchOccupancies",
                columns: new[] { "PitchId", "OccupancyDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PitchOccupancies_ReservationId",
                table: "PitchOccupancies",
                column: "ReservationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppLocks");

            migrationBuilder.DropTable(
                name: "PitchOccupancies");
        }
    }
}
