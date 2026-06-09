using CampingManager.Dto;
using CampingManager.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CampingEquipmentTypesController : ApiControllerBase
    {
        private readonly ICampingEquipmentTypeService _campingEquipmentTypeService;

        public CampingEquipmentTypesController(ICampingEquipmentTypeService campingEquipmentTypeService)
        {
            _campingEquipmentTypeService = campingEquipmentTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<CampingEquipmentTypeDto>>> GetAll(
            [FromQuery] CampingEquipmentTypeQueryDto query)
        {
            var equipmentTypes = await _campingEquipmentTypeService.GetAllAsync(query);

            return Ok(equipmentTypes);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CampingEquipmentTypeDto>> GetById(int id)
        {
            var equipmentType = await _campingEquipmentTypeService.GetByIdAsync(id);

            return equipmentType is null ? NotFound() : Ok(equipmentType);
        }

        [HttpPost]
        public async Task<ActionResult<CampingEquipmentTypeDto>> Create(CreateCampingEquipmentTypeDto dto)
        {
            var result = await _campingEquipmentTypeService.CreateAsync(dto);

            if (!result.Succeeded)
            {
                return ToErrorResult(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<CampingEquipmentTypeDto>> Update(int id, UpdateCampingEquipmentTypeDto dto)
        {
            var result = await _campingEquipmentTypeService.UpdateAsync(id, dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _campingEquipmentTypeService.DeleteAsync(id);

            return result.Succeeded ? NoContent() : ToErrorResult(result);
        }
    }
}
