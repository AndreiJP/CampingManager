using System.Security.Claims;
using CampingManager.Dto;
using CampingManager.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ApiControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("bootstrap-admin")]
        public async Task<ActionResult<AuthResponseDto>> BootstrapAdmin(BootstrapAdminDto dto)
        {
            var result = await _authService.BootstrapAdminAsync(dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(AdminLoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
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
    }
}
