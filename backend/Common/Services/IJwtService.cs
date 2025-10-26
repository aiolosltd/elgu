using backend.Common.Models;

namespace backend.Common.Services;

public interface IJwtService
{
    string GenerateToken(User user);
    string? ValidateToken(string token);
}