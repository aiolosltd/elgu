using backend.Common.Services;
using backend.Data;
using Microsoft.EntityFrameworkCore;


namespace backend.Features.Authentication.Login
{
    public class LoginService
    {
        private readonly DatabaseContext _context;
        private readonly IJwtService _jwtService;
        private readonly IPasswordHasher _passwordHasher;

        public LoginService(DatabaseContext context, IJwtService jwtService, IPasswordHasher passwordHasher)
        {
            _context = context;
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
        }

        public async Task<LoginResponse?> Authenticate(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Status);

            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.Password))
                return null;

            // Update last activity
            user.LastActivity = DateTime.Now;
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return new LoginResponse
            {
                Token = token,
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Expires = DateTime.Now.AddHours(1)
            };
        }
    }
}
