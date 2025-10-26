using backend.Common.DTOs;
//using backend.Features.Business.CreateBusiness;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Business.CreateBusiness;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BusinessController : ControllerBase
{
    private readonly CreateBusinessService _createBusinessService;

    public BusinessController(CreateBusinessService createBusinessService)
    {
        _createBusinessService = createBusinessService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateBusinessResponse>>> CreateBusiness(CreateBusinessRequest request)
    {
        var userId = HttpContext.Items["UserId"] as string;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse<CreateBusinessResponse>.ErrorResponse("User not authenticated"));

        var response = await _createBusinessService.CreateBusiness(request, userId);
        return Ok(ApiResponse<CreateBusinessResponse>.SuccessResponse(response, "Business created successfully"));
    }
}