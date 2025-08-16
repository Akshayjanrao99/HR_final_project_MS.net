using MyApiBackend.Models;

namespace MyApiBackend.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? textContent = null);
        Task<bool> SendWelcomeEmailAsync(Employee employee, string tempPassword);
        Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken);
    }
}
