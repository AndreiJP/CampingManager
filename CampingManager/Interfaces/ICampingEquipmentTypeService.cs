using CampingManager.Dto;
using CampingManager.Services;

namespace CampingManager.Interfaces
{
    public interface ICampingEquipmentTypeService
    {
        Task<PagedResultDto<CampingEquipmentTypeDto>> GetAllAsync(CampingEquipmentTypeQueryDto query);
        Task<CampingEquipmentTypeDto?> GetByIdAsync(int id);
        Task<ServiceResult<CampingEquipmentTypeDto>> CreateAsync(CreateCampingEquipmentTypeDto dto);
        Task<ServiceResult<CampingEquipmentTypeDto>> UpdateAsync(int id, UpdateCampingEquipmentTypeDto dto);
        Task<ServiceResult<bool>> DeleteAsync(int id);
    }
}
