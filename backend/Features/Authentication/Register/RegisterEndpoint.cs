using backend.Common.DTOs;
//using backend.Features.Authentication.Register;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Authentication.Register;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly RegisterService _registerService;

    public RegisterController(RegisterService registerService)
    {
        _registerService = registerService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Register(RegisterRequest request)
    {
        var success = await _registerService.Register(request);

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse("Username or email already exists"));

        return Ok(ApiResponse<object>.SuccessResponse(null, "Registration successful"));
    }
}