namespace backend.Common.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public bool Status { get; set; }
        public DateTime Registered { get; set; }
        public DateTime LastActivity { get; set; }
        public string Role { get; set; } = "User";
    }
}
