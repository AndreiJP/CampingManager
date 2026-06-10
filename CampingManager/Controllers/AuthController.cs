using System.Security.Claims;
using CampingManager.Authorization;
using CampingManager.Dto;
using CampingManager.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ApiControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _environment;

        public AuthController(IAuthService authService, IWebHostEnvironment environment)
        {
            _authService = authService;
            _environment = environment;
        }

        [AllowAnonymous]
        [EnableRateLimiting("AdminBootstrap")]
        [HttpPost("bootstrap-admin")]
        public async Task<ActionResult<AuthResponseDto>> BootstrapAdmin(
            BootstrapAdminDto dto,
            [FromHeader(Name = AdminAuthConstants.SetupTokenHeaderName)] string? setupToken)
        {
            var result = await _authService.BootstrapAdminAsync(dto, setupToken);

            if (!result.Succeeded)
            {
                return ToErrorResult(result);
            }

            AppendAuthCookie(result.Value!);

            return Ok(result.Value);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(AdminLoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);

            if (!result.Succeeded)
            {
                return ToErrorResult(result);
            }

            AppendAuthCookie(result.Value!);

            return Ok(result.Value);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(
                AdminAuthConstants.AccessTokenCookieName,
                CreateCookieOptions(DateTimeOffset.UtcNow));

            return NoContent();
        }

        [HttpGet("me")]
        public async Task<ActionResult<AdminUserDto>> Me()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var result = await _authService.GetByIdAsync(userId);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        private void AppendAuthCookie(AuthResponseDto authResponse)
        {
            Response.Cookies.Append(
                AdminAuthConstants.AccessTokenCookieName,
                authResponse.AccessToken,
                CreateCookieOptions(authResponse.ExpiresAt));
        }

        private CookieOptions CreateCookieOptions(DateTimeOffset expiresAt)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = !_environment.IsDevelopment(),
                SameSite = SameSiteMode.Lax,
                Expires = expiresAt,
                Path = "/"
            };
        }
    }
}
