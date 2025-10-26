using backend.Data;
using Microsoft.EntityFrameworkCore;
using BusinessEntity = backend.Common.Models.Business; // Create alias

namespace backend.Features.Business.GetBusiness;

public class GetBusinessService
{
    private readonly DatabaseContext _context;

    public GetBusinessService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<BusinessEntity?> GetBusinessById(string businessId)
    {
        return await _context.Businesses
            .Include(b => b.Address)
            .Include(b => b.Representative)
            .Include(b => b.Requirements)
            .FirstOrDefaultAsync(b => b.BusinessId == businessId && b.Status);
    }

    public async Task<List<BusinessEntity>> GetAllBusinesses()
    {
        return await _context.Businesses
            .Include(b => b.Address)
            .Where(b => b.Status)
            .ToListAsync();
    }
}