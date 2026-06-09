using CampingManager.Dto;
using Microsoft.EntityFrameworkCore;

namespace CampingManager.Services
{
    internal static class PaginationExtensions
    {
        public static async Task<PagedResultDto<T>> ToPagedResultAsync<T>(
            this IQueryable<T> query,
            int pageNumber,
            int pageSize)
        {
            var safePageNumber = Math.Max(pageNumber, 1);
            var safePageSize = Math.Clamp(pageSize, 1, 100);
            var totalCount = await query.CountAsync();
            var totalPages = totalCount == 0
                ? 0
                : (int)Math.Ceiling(totalCount / (double)safePageSize);

            var items = await query
                .Skip((safePageNumber - 1) * safePageSize)
                .Take(safePageSize)
                .ToListAsync();

            return new PagedResultDto<T>
            {
                Items = items,
                PageNumber = safePageNumber,
                PageSize = safePageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }
    }
}
