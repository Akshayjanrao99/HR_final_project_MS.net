using MyApiBackend.Models;

namespace MyApiBackend.Services
{
    public interface IJwtService
    {
        string GenerateToken(Employee employee);
        string GenerateToken(User user);
        bool ValidateToken(string token);
        string? GetUserIdFromToken(string token);
        string? GetEmailFromToken(string token);
    }
}
