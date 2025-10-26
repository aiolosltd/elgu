using backend.Data;
//using backend.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Lookup.GetLookupOptions;

public class GetLookupOptionsService
{
    private readonly DatabaseContext _context;

    public GetLookupOptionsService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<Dictionary<string, List<string>>> GetLookupOptions()
    {
        var options = await _context.CbOptions
            .Where(o => o.Status)
            .ToListAsync();

        var result = new Dictionary<string, List<string>>();

        foreach (var option in options)
        {
            if (!result.ContainsKey(option.CbType))
            {
                result[option.CbType] = new List<string>();
            }
            result[option.CbType].Add(option.Value);
        }

        return result;
    }

    public async Task<List<string>> GetLookupOptionsByType(string type)
    {
        return await _context.CbOptions
            .Where(o => o.CbType == type && o.Status)
            .Select(o => o.Value)
            .ToListAsync();
    }
}