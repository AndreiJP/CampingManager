using CampingManager.Dto;
using CampingManager.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ApiControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<CustomerDto>>> GetAll([FromQuery] CustomerQueryDto query)
        {
            var customers = await _customerService.GetAllAsync(query);

            return Ok(customers);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CustomerDto>> GetById(int id)
        {
            var customer = await _customerService.GetByIdAsync(id);

            return customer is null ? NotFound() : Ok(customer);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> Create(CreateCustomerDto dto)
        {
            var result = await _customerService.CreateAsync(dto);

            if (!result.Succeeded)
            {
                return ToErrorResult(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<CustomerDto>> Update(int id, UpdateCustomerDto dto)
        {
            var result = await _customerService.UpdateAsync(id, dto);

            return result.Succeeded ? Ok(result.Value) : ToErrorResult(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _customerService.DeleteAsync(id);

            return result.Succeeded ? NoContent() : ToErrorResult(result);
        }

    }
}
