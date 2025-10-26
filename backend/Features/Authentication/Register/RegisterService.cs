using backend.Common.Models;
using backend.Common.Services;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Authentication.Register;

public class RegisterService
{
    private readonly DatabaseContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterService(DatabaseContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<bool> Register(RegisterRequest request)
    {
        // Check if username already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Email);

        if (existingUser != null)
            return false;

        var user = new User
        {
            UserId = GenerateUserId(),
            Username = request.Username,
            Password = _passwordHasher.HashPassword(request.Password),
            FullName = request.FullName,
            Email = request.Email,
            Status = true,
            Registered = DateTime.Now,
            LastActivity = DateTime.Now,
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return true;
    }

    private string GenerateUserId()
    {
        return $"USER_{DateTime.Now:yyyyMMddHHmmss}_{new Random().Next(1000, 9999)}";
    }
}