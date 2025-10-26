using backend.Common.DTOs;
//using backend.Features.Lookup.GetLookupOptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Lookup.GetLookupOptions;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LookupController : ControllerBase
{
    private readonly GetLookupOptionsService _lookupService;

    public LookupController(GetLookupOptionsService lookupService)
    {
        _lookupService = lookupService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<Dictionary<string, List<string>>>>> GetAllOptions()
    {
        var options = await _lookupService.GetLookupOptions();
        return Ok(ApiResponse<Dictionary<string, List<string>>>.SuccessResponse(options));
    }

    [HttpGet("{type}")]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetOptionsByType(string type)
    {
        var options = await _lookupService.GetLookupOptionsByType(type);
        return Ok(ApiResponse<List<string>>.SuccessResponse(options));
    }
}