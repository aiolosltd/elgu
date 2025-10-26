using backend.Common.Services;

namespace backend.Common.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IJwtService jwtService)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (!string.IsNullOrEmpty(token))
        {
            var userId = jwtService.ValidateToken(token);
            if (!string.IsNullOrEmpty(userId))
            {
                context.Items["UserId"] = userId;
            }
        }

        await _next(context);
    }
}