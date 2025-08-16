using Microsoft.AspNetCore.Mvc;
using MyApiBackend.Services;
using MyApiBackend.Models;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailTestController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailTestController> _logger;

        public EmailTestController(IEmailService emailService, ILogger<EmailTestController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ToEmail))
            {
                return BadRequest(new { message = "Email address is required" });
            }

            try
            {
                var subject = "Test Email from Employee Management System";
                var htmlContent = @"
                    <h1>Test Email</h1>
                    <p>This is a test email from your Employee Management System.</p>
                    <p>If you received this email, the email configuration is working correctly.</p>";
                
                var success = await _emailService.SendEmailAsync(request.ToEmail, subject, htmlContent);
                
                if (success)
                {
                    _logger.LogInformation($"Test email sent successfully to {request.ToEmail}");
                    return Ok(new { message = "Test email sent successfully", success = true });
                }
                else
                {
                    _logger.LogError($"Failed to send test email to {request.ToEmail}");
                    return StatusCode(500, new { message = "Failed to send test email", success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending test email to {request.ToEmail}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("test-welcome-email")]
        public async Task<IActionResult> TestWelcomeEmail([FromBody] TestWelcomeEmailRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ToEmail))
            {
                return BadRequest(new { message = "Email address is required" });
            }

            try
            {
                // Create a test employee object
                var testEmployee = new Employee
                {
                    Id = 999,
                    Name = request.Name ?? "Test Employee",
                    Email = request.ToEmail,
                    Department = "IT",
                    Designation = "Software Developer",
                    JoinDate = DateTime.Now
                };

                var testPassword = "TestPass123!";
                var success = await _emailService.SendWelcomeEmailAsync(testEmployee, testPassword);
                
                if (success)
                {
                    _logger.LogInformation($"Test welcome email sent successfully to {request.ToEmail}");
                    return Ok(new { message = "Test welcome email sent successfully", success = true });
                }
                else
                {
                    _logger.LogError($"Failed to send test welcome email to {request.ToEmail}");
                    return StatusCode(500, new { message = "Failed to send test welcome email", success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending test welcome email to {request.ToEmail}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    public class TestEmailRequest
    {
        public string ToEmail { get; set; } = string.Empty;
    }

    public class TestWelcomeEmailRequest
    {
        public string ToEmail { get; set; } = string.Empty;
        public string? Name { get; set; }
    }
}
