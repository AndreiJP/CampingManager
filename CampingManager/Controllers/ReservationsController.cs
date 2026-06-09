using CampingManager.Dto;
using CampingManager.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ApiControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<ReservationDto>>> GetAll([FromQuery] ReservationQueryDto query)
        {
            var reservations = await _reservationService.GetAllAsync(query);

            return Ok(reservations);
        }

        [HttpGet("availability")]
        public async Task<ActionResult<IEnumerable<PitchAvailabilityDto>>> GetAvailability(
            [FromQuery] ReservationAvailabilityQueryDto query)
        {
            var result = await _reservationService.GetAvailabilityAsync(query);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReservationDto>> GetById(int id)
        {
            var reservation = await _reservationService.GetByIdAsync(id);

            return reservation is null ? NotFound() : Ok(reservation);
        }

        [HttpPost]
        public async Task<ActionResult<ReservationDto>> Create(CreateReservationDto dto)
        {
            var result = await _reservationService.CreateAsync(dto);

            if (!result.Succeeded)
            {
                return ToErrorResult(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ReservationDto>> Update(int id, UpdateReservationDto dto)
        {
            var result = await _reservationService.UpdateAsync(id, dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<ActionResult<ReservationDto>> ChangeStatus(int id, ChangeReservationStatusDto dto)
        {
            var result = await _reservationService.ChangeStatusAsync(id, dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpPost("{id:int}/confirm")]
        public async Task<ActionResult<ReservationDto>> Confirm(int id)
        {
            var result = await _reservationService.ConfirmAsync(id);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpPost("{id:int}/check-in")]
        public async Task<ActionResult<ReservationDto>> CheckIn(int id)
        {
            var result = await _reservationService.CheckInAsync(id);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpPost("{id:int}/check-out")]
        public async Task<ActionResult<ReservationDto>> CheckOut(int id)
        {
            var result = await _reservationService.CheckOutAsync(id);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpPost("{id:int}/cancel")]
        public async Task<ActionResult<ReservationDto>> Cancel(int id)
        {
            var result = await _reservationService.CancelAsync(id);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _reservationService.DeleteAsync(id);

            return result.Succeeded ? NoContent() : ToErrorResult(result);
        }

    }
}
