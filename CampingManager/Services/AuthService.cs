using System.IdentityModel.Tokens.Jwt;
using System.Data;
using System.Security.Claims;
using System.Security.Cryptography;
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
        private readonly AdminBootstrapOptions _adminBootstrapOptions;
        private readonly IClock _clock;
        private readonly ILogger<AuthService> _logger;
        private readonly PasswordHasher<AdminUser> _passwordHasher;

        public AuthService(
            AppDbContext context,
            IOptions<JwtSettings> jwtOptions,
            IOptions<AdminBootstrapOptions> adminBootstrapOptions,
            IClock clock,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
            _adminBootstrapOptions = adminBootstrapOptions.Value;
            _clock = clock;
            _logger = logger;
            _passwordHasher = new PasswordHasher<AdminUser>();
        }

        public async Task<ServiceResult<AuthResponseDto>> BootstrapAdminAsync(BootstrapAdminDto dto, string? setupToken)
        {
            if (!_adminBootstrapOptions.Enabled)
            {
                return ServiceResult<AuthResponseDto>.Failure(
                    ServiceErrorType.Conflict,
                    "Admin bootstrap is disabled.");
            }

            if (!IsSetupTokenValid(setupToken))
            {
                return ServiceResult<AuthResponseDto>.Failure(
                    ServiceErrorType.Unauthorized,
                    "Admin bootstrap setup token is invalid.");
            }

            var email = NormalizeEmail(dto.Email);
            var now = _clock.UtcNow;
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

            await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            var hasAnyAdmin = await _context.AdminUsers.AnyAsync();

            if (hasAnyAdmin)
            {
                return ServiceResult<AuthResponseDto>.Failure(
                    ServiceErrorType.Conflict,
                    "Admin bootstrap is disabled because an admin user already exists.");
            }

            _context.AppLocks.Add(new AppLock
            {
                Key = AppLockKeys.AdminBootstrap,
                CreatedAt = now
            });

            _context.AdminUsers.Add(adminUser);

            try
            {
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateException exception)
            {
                _logger.LogWarning(exception, "Admin bootstrap failed because the bootstrap lock already exists.");

                return ServiceResult<AuthResponseDto>.Failure(
                    ServiceErrorType.Conflict,
                    "Admin bootstrap was already completed or is already running.");
            }

            _logger.LogInformation("Admin user {AdminUserId} bootstrapped.", adminUser.Id);

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
                adminUser.UpdatedAt = _clock.UtcNow;
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Admin user {AdminUserId} logged in.", adminUser.Id);

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
            var expiresAt = _clock.UtcNow.AddMinutes(_jwtSettings.ExpiresMinutes);
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

        private bool IsSetupTokenValid(string? setupToken)
        {
            if (string.IsNullOrWhiteSpace(setupToken) ||
                string.IsNullOrWhiteSpace(_adminBootstrapOptions.SetupToken))
            {
                return false;
            }

            var actualBytes = Encoding.UTF8.GetBytes(setupToken);
            var expectedBytes = Encoding.UTF8.GetBytes(_adminBootstrapOptions.SetupToken);

            return actualBytes.Length == expectedBytes.Length &&
                CryptographicOperations.FixedTimeEquals(actualBytes, expectedBytes);
        }
    }
}
