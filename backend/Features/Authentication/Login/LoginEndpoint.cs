using backend.Common.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Authentication.Login;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly LoginService _loginService;

    public LoginController(LoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(LoginRequest request)
    {
        var response = await _loginService.Authenticate(request);

        if (response == null)
            return Unauthorized(ApiResponse<LoginResponse>.ErrorResponse("Invalid username or password"));

        return Ok(ApiResponse<LoginResponse>.SuccessResponse(response, "Login successful"));
    }
}