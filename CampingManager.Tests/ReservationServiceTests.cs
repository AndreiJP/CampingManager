using CampingManager.Dto;
using CampingManager.Models;
using CampingManager.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace CampingManager.Tests;

public class ReservationServiceTests
{
    [Fact]
    public async Task CreateAsync_RejectsOverlappingBlockingReservation()
    {
        using var harness = await ServiceTestHarness.CreateAsync();
        var seed = await harness.SeedReservationLookupsAsync();
        var service = CreateService(harness);

        var first = await service.CreateAsync(CreateReservation("RES-1", seed, harness));
        var second = await service.CreateAsync(CreateReservation("RES-2", seed, harness));

        Assert.True(first.Succeeded);
        Assert.False(second.Succeeded);
        Assert.Equal(ServiceErrorType.Conflict, second.ErrorType);
        Assert.Equal(2, await harness.Context.PitchOccupancies.CountAsync());
    }

    [Fact]
    public async Task CancelAsync_RemovesOccupancyAndAllowsSamePitchDatesAgain()
    {
        using var harness = await ServiceTestHarness.CreateAsync();
        var seed = await harness.SeedReservationLookupsAsync();
        var service = CreateService(harness);

        var first = await service.CreateAsync(CreateReservation("RES-1", seed, harness));
        var cancel = await service.CancelAsync(first.Value!.Id);
        var second = await service.CreateAsync(CreateReservation("RES-2", seed, harness));

        Assert.True(cancel.Succeeded);
        Assert.True(second.Succeeded);
        Assert.Equal(2, await harness.Context.PitchOccupancies.CountAsync());
    }

    [Fact]
    public async Task CheckInAsync_RejectsInvalidTransitionFromPending()
    {
        using var harness = await ServiceTestHarness.CreateAsync();
        var seed = await harness.SeedReservationLookupsAsync();
        var service = CreateService(harness);

        var reservation = await service.CreateAsync(CreateReservation("RES-1", seed, harness));
        var checkIn = await service.CheckInAsync(reservation.Value!.Id);

        Assert.False(checkIn.Succeeded);
        Assert.Equal(ServiceErrorType.Validation, checkIn.ErrorType);
    }

    [Fact]
    public async Task CreateAsync_RejectsPastCheckInDate()
    {
        using var harness = await ServiceTestHarness.CreateAsync();
        var seed = await harness.SeedReservationLookupsAsync();
        var service = CreateService(harness);

        var request = CreateReservation("RES-1", seed, harness);
        request.CheckInDate = harness.Clock.UtcToday.AddDays(-1);
        request.CheckOutDate = harness.Clock.UtcToday.AddDays(1);

        var result = await service.CreateAsync(request);

        Assert.False(result.Succeeded);
        Assert.Equal(ServiceErrorType.Validation, result.ErrorType);
    }

    private static ReservationService CreateService(ServiceTestHarness harness)
    {
        return new ReservationService(
            harness.Context,
            harness.Clock,
            NullLogger<ReservationService>.Instance);
    }

    private static CreateReservationDto CreateReservation(string code, SeedData seed, ServiceTestHarness harness)
    {
        return new CreateReservationDto
        {
            ReservationCode = code,
            CustomerId = seed.CustomerId,
            PitchId = seed.PitchId,
            CampingEquipmentTypeId = seed.EquipmentTypeId,
            CheckInDate = harness.Clock.UtcToday.AddDays(1),
            CheckOutDate = harness.Clock.UtcToday.AddDays(3),
            AdultsCount = 2,
            ChildrenCount = 0,
            PetsCount = 0,
            Status = ReservationStatus.Pending
        };
    }
}
