using CampingManager.Dto;
using CampingManager.Services;

namespace CampingManager.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResult<AuthResponseDto>> BootstrapAdminAsync(BootstrapAdminDto dto, string? setupToken);
        Task<ServiceResult<AuthResponseDto>> LoginAsync(AdminLoginDto dto);
        Task<ServiceResult<AdminUserDto>> GetByIdAsync(int id);
    }
}
