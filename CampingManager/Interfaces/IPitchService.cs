using CampingManager.Dto;
using CampingManager.Services;

namespace CampingManager.Interfaces
{
    public interface IPitchService
    {
        Task<PagedResultDto<PitchDto>> GetAllAsync(PitchQueryDto query);
        Task<PitchDto?> GetByIdAsync(int id);
        Task<ServiceResult<PitchDto>> CreateAsync(CreatePitchDto dto);
        Task<ServiceResult<PitchDto>> UpdateAsync(int id, UpdatePitchDto dto);
        Task<ServiceResult<bool>> DeleteAsync(int id);
    }
}
