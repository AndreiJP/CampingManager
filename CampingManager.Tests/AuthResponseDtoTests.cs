using System.Text.Json;
using CampingManager.Dto;

namespace CampingManager.Tests;

public class AuthResponseDtoTests
{
    [Fact]
    public void AuthResponseDto_CanBeSerializedWithoutAccessToken()
    {
        var response = new AuthResponseDto
        {
            AccessToken = "server-cookie-token",
            ExpiresAt = new DateTime(2026, 6, 10, 12, 0, 0, DateTimeKind.Utc),
            User = new AdminUserDto
            {
                Id = 1,
                Email = "admin@example.test",
                Role = "Admin",
                IsActive = true
            }
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        Assert.DoesNotContain("accessToken", json);
        Assert.Contains("expiresAt", json);
        Assert.Contains("user", json);
    }
}
