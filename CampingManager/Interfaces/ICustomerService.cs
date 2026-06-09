using CampingManager.Dto;
using CampingManager.Services;

namespace CampingManager.Interfaces
{
    public interface ICustomerService
    {
        Task<PagedResultDto<CustomerDto>> GetAllAsync(CustomerQueryDto query);
        Task<CustomerDto?> GetByIdAsync(int id);
        Task<ServiceResult<CustomerDto>> CreateAsync(CreateCustomerDto dto);
        Task<ServiceResult<CustomerDto>> UpdateAsync(int id, UpdateCustomerDto dto);
        Task<ServiceResult<bool>> DeleteAsync(int id);
    }
}
