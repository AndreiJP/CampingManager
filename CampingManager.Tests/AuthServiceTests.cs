using CampingManager.Dto;
using CampingManager.Options;
using CampingManager.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace CampingManager.Tests;

public class AuthServiceTests
{
    private const string SetupToken = "test-bootstrap-token-12345";

    [Fact]
    public async Task BootstrapAdminAsync_RequiresValidSetupToken()
    {
        using var harness = await ServiceTestHarness.CreateAsync();
        var service = CreateService(harness);

        var result = await service.BootstrapAdminAsync(CreateBootstrapDto(), "wrong-token");

        Assert.False(result.Succeeded);
        Assert.Equal(ServiceErrorType.Unauthorized, result.ErrorType);
        Assert.Empty(await harness.Context.AdminUsers.ToListAsync());
    }

    [Fact]
    public async Task BootstrapAdminAsync_AllowsOnlyOneAdmin()
    {
        using var harness = await ServiceTestHarness.CreateAsync();
        var service = CreateService(harness);

        var first = await service.BootstrapAdminAsync(CreateBootstrapDto(), SetupToken);
        var second = await service.BootstrapAdminAsync(new BootstrapAdminDto
        {
            Email = "second@example.test",
            Password = "another-strong-password"
        }, SetupToken);

        Assert.True(first.Succeeded);
        Assert.False(second.Succeeded);
        Assert.Equal(ServiceErrorType.Conflict, second.ErrorType);
        Assert.Single(await harness.Context.AdminUsers.ToListAsync());
        Assert.Single(await harness.Context.AppLocks.ToListAsync());
    }

    private static AuthService CreateService(ServiceTestHarness harness)
    {
        return new AuthService(
            harness.Context,
            Microsoft.Extensions.Options.Options.Create(new JwtSettings
            {
                Issuer = "CampingManager.Tests",
                Audience = "CampingManager.Admin.Tests",
                SecretKey = "test-secret-key-with-more-than-32-characters",
                ExpiresMinutes = 120
            }),
            Microsoft.Extensions.Options.Options.Create(new AdminBootstrapOptions
            {
                Enabled = true,
                SetupToken = SetupToken
            }),
            harness.Clock,
            NullLogger<AuthService>.Instance);
    }

    private static BootstrapAdminDto CreateBootstrapDto()
    {
        return new BootstrapAdminDto
        {
            Email = "admin@example.test",
            Password = "strong-password"
        };
    }
}
