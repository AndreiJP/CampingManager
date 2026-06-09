using CampingManager.Dto;
using CampingManager.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PitchesController : ApiControllerBase
    {
        private readonly IPitchService _pitchService;

        public PitchesController(IPitchService pitchService)
        {
            _pitchService = pitchService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<PitchDto>>> GetAll([FromQuery] PitchQueryDto query)
        {
            var pitches = await _pitchService.GetAllAsync(query);

            return Ok(pitches);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PitchDto>> GetById(int id)
        {
            var pitch = await _pitchService.GetByIdAsync(id);

            return pitch is null ? NotFound() : Ok(pitch);
        }

        [HttpPost]
        public async Task<ActionResult<PitchDto>> Create(CreatePitchDto dto)
        {
            var result = await _pitchService.CreateAsync(dto);

            if (!result.Succeeded)
            {
                return ToErrorResult(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<PitchDto>> Update(int id, UpdatePitchDto dto)
        {
            var result = await _pitchService.UpdateAsync(id, dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _pitchService.DeleteAsync(id);

            return result.Succeeded ? NoContent() : ToErrorResult(result);
        }
    }
}
