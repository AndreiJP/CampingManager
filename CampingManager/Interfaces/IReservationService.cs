using CampingManager.Dto;
using CampingManager.Services;

namespace CampingManager.Interfaces
{
    public interface IReservationService
    {
        Task<PagedResultDto<ReservationDto>> GetAllAsync(ReservationQueryDto query);
        Task<ServiceResult<IReadOnlyList<PitchAvailabilityDto>>> GetAvailabilityAsync(ReservationAvailabilityQueryDto query);
        Task<ReservationDto?> GetByIdAsync(int id);
        Task<ServiceResult<ReservationDto>> CreateAsync(CreateReservationDto dto);
        Task<ServiceResult<ReservationDto>> UpdateAsync(int id, UpdateReservationDto dto);
        Task<ServiceResult<ReservationDto>> ChangeStatusAsync(int id, ChangeReservationStatusDto dto);
        Task<ServiceResult<ReservationDto>> ConfirmAsync(int id);
        Task<ServiceResult<ReservationDto>> CheckInAsync(int id);
        Task<ServiceResult<ReservationDto>> CheckOutAsync(int id);
        Task<ServiceResult<ReservationDto>> CancelAsync(int id);
        Task<ServiceResult<bool>> DeleteAsync(int id);
    }
}
