using CampingManager.Data;
using CampingManager.Dto;
using CampingManager.Interfaces;
using CampingManager.Models;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<CustomerDto>> GetAllAsync(CustomerQueryDto queryDto)
        {
            var query = _context.Customers.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(queryDto.Search))
            {
                var searchPattern = $"%{queryDto.Search.Trim()}%";

                query = query.Where(customer =>
                    EF.Functions.Like(customer.FirstName, searchPattern) ||
                    EF.Functions.Like(customer.LastName, searchPattern) ||
                    EF.Functions.Like(customer.Email, searchPattern) ||
                    (customer.PhoneNumber != null && EF.Functions.Like(customer.PhoneNumber, searchPattern)));
            }

            return await query
                .OrderBy(customer => customer.LastName)
                .ThenBy(customer => customer.FirstName)
                .Select(customer => new CustomerDto
                {
                    Id = customer.Id,
                    FirstName = customer.FirstName,
                    LastName = customer.LastName,
                    Email = customer.Email,
                    PhoneNumber = customer.PhoneNumber,
                    CreatedAt = customer.CreatedAt,
                    UpdatedAt = customer.UpdatedAt
                })
                .ToPagedResultAsync(queryDto.PageNumber, queryDto.PageSize);
        }

        public async Task<CustomerDto?> GetByIdAsync(int id)
        {
            return await _context.Customers
                .AsNoTracking()
                .Where(customer => customer.Id == id)
                .Select(customer => new CustomerDto
                {
                    Id = customer.Id,
                    FirstName = customer.FirstName,
                    LastName = customer.LastName,
                    Email = customer.Email,
                    PhoneNumber = customer.PhoneNumber,
                    CreatedAt = customer.CreatedAt,
                    UpdatedAt = customer.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceResult<CustomerDto>> CreateAsync(CreateCustomerDto dto)
        {
            var validationError = ValidateCustomerInput(dto.FirstName, dto.LastName, dto.Email);

            if (validationError is not null)
            {
                return ServiceResult<CustomerDto>.Failure(ServiceErrorType.Validation, validationError);
            }

            var email = NormalizeEmail(dto.Email);

            var exists = await _context.Customers
                .AnyAsync(customer => customer.Email.ToLower() == email);

            if (exists)
            {
                return ServiceResult<CustomerDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A customer with email '{email}' already exists.");
            }

            var now = DateTime.UtcNow;
            var customer = new Customer
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = email,
                PhoneNumber = NormalizeOptional(dto.PhoneNumber),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Customers.Add(customer);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return ServiceResult<CustomerDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A customer with email '{email}' already exists.");
            }

            return ServiceResult<CustomerDto>.Success(ToDto(customer));
        }

        public async Task<ServiceResult<CustomerDto>> UpdateAsync(int id, UpdateCustomerDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer is null)
            {
                return ServiceResult<CustomerDto>.Failure(
                    ServiceErrorType.NotFound,
                    "Customer not found.");
            }

            var validationError = ValidateCustomerInput(dto.FirstName, dto.LastName, dto.Email);

            if (validationError is not null)
            {
                return ServiceResult<CustomerDto>.Failure(ServiceErrorType.Validation, validationError);
            }

            var email = NormalizeEmail(dto.Email);

            var exists = await _context.Customers
                .AnyAsync(existingCustomer =>
                    existingCustomer.Id != id &&
                    existingCustomer.Email.ToLower() == email);

            if (exists)
            {
                return ServiceResult<CustomerDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A customer with email '{email}' already exists.");
            }

            customer.FirstName = dto.FirstName.Trim();
            customer.LastName = dto.LastName.Trim();
            customer.Email = email;
            customer.PhoneNumber = NormalizeOptional(dto.PhoneNumber);
            customer.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return ServiceResult<CustomerDto>.Failure(
                    ServiceErrorType.Conflict,
                    $"A customer with email '{email}' already exists.");
            }

            return ServiceResult<CustomerDto>.Success(ToDto(customer));
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer is null)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.NotFound,
                    "Customer not found.");
            }

            var hasReservations = await _context.Reservations
                .AnyAsync(reservation => reservation.CustomerId == id);

            if (hasReservations)
            {
                return ServiceResult<bool>.Failure(
                    ServiceErrorType.Conflict,
                    "This customer cannot be deleted because it has one or more reservations.");
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return ServiceResult<bool>.Success(true);
        }

        private static CustomerDto ToDto(Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };
        }

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }

        private static string? ValidateCustomerInput(string firstName, string lastName, string email)
        {
            if (string.IsNullOrWhiteSpace(firstName))
            {
                return "FirstName cannot be empty.";
            }

            if (string.IsNullOrWhiteSpace(lastName))
            {
                return "LastName cannot be empty.";
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                return "Email cannot be empty.";
            }

            return null;
        }

        private static string? NormalizeOptional(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
    }
}
