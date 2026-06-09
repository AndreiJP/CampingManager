using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CampingManager.Authorization;
using CampingManager.Data;
using CampingManager.Dto;
using CampingManager.Interfaces;
using CampingManager.Models;
using CampingManager.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CampingManager.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly PasswordHasher<AdminUser> _passwordHasher;

        public AuthService(AppDbContext context, IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
            _passwordHasher = new PasswordHasher<AdminUser>();
        }

        public async Task<ServiceResult<AuthResponseDto>> BootstrapAdminAsync(BootstrapAdminDto dto)
        {
            var hasAnyAdmin = await _context.AdminUsers.AnyAsync();

            if (hasAnyAdmin)
            {
                return ServiceResult<AuthResponseDto>.Failure(
                    ServiceErrorType.Conflict,
                    "Admin bootstrap is disabled because an admin user already exists.");
            }

            var email = NormalizeEmail(dto.Email);
            var now = DateTime.UtcNow;
            var adminUser = new AdminUser
            {
                Email = email,
                PasswordHash = string.Empty,
                Role = AdminAuthConstants.AdminRole,
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            };

            adminUser.PasswordHash = _passwordHasher.HashPassword(adminUser, dto.Password);

            _context.AdminUsers.Add(adminUser);
            await _context.SaveChangesAsync();

            return ServiceResult<AuthResponseDto>.Success(CreateAuthResponse(adminUser));
        }

        public async Task<ServiceResult<AuthResponseDto>> LoginAsync(AdminLoginDto dto)
        {
            var email = NormalizeEmail(dto.Email);
            var adminUser = await _context.AdminUsers
                .FirstOrDefaultAsync(user => user.Email == email);

            if (adminUser is null || !adminUser.IsActive)
            {
                return InvalidCredentials();
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(
                adminUser,
                adminUser.PasswordHash,
                dto.Password);

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return InvalidCredentials();
            }

            if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
            {
                adminUser.PasswordHash = _passwordHasher.HashPassword(adminUser, dto.Password);
                adminUser.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return ServiceResult<AuthResponseDto>.Success(CreateAuthResponse(adminUser));
        }

        public async Task<ServiceResult<AdminUserDto>> GetByIdAsync(int id)
        {
            var adminUser = await _context.AdminUsers
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == id && user.IsActive);

            if (adminUser is null)
            {
                return ServiceResult<AdminUserDto>.Failure(
                    ServiceErrorType.NotFound,
                    "Admin user not found.");
            }

            return ServiceResult<AdminUserDto>.Success(ToDto(adminUser));
        }

        private AuthResponseDto CreateAuthResponse(AdminUser adminUser)
        {
            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresMinutes);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, adminUser.Id.ToString()),
                new Claim(ClaimTypes.Email, adminUser.Email),
                new Claim(ClaimTypes.Role, adminUser.Role),
                new Claim(JwtRegisteredClaimNames.Sub, adminUser.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, adminUser.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return new AuthResponseDto
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expiresAt,
                User = ToDto(adminUser)
            };
        }

        private static ServiceResult<AuthResponseDto> InvalidCredentials()
        {
            return ServiceResult<AuthResponseDto>.Failure(
                ServiceErrorType.Unauthorized,
                "Invalid email or password.");
        }

        private static AdminUserDto ToDto(AdminUser adminUser)
        {
            return new AdminUserDto
            {
                Id = adminUser.Id,
                Email = adminUser.Email,
                Role = adminUser.Role,
                IsActive = adminUser.IsActive
            };
        }

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }
    }
}
