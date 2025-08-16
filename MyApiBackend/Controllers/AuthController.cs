using Microsoft.AspNetCore.Mvc;
using MyApiBackend.Services;
using MyApiBackend.Models;
using MyApiBackend.Data;
using MyApiBackend.Utils;
using Microsoft.EntityFrameworkCore;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController> _logger;
        private readonly IJwtService _jwtService;

        public AuthController(IUserService userService, AppDbContext context, ILogger<AuthController> logger, IJwtService jwtService)
        {
            _userService = userService;
            _context = context;
            _logger = logger;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Username and password are required" });
                }

                // Check if it's an employee login (by email)
                var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == request.Username);
                if (employee != null)
                {
                    // Verify employee password
                    if (PasswordHelper.VerifyPassword(request.Password, employee.Password))
                    {
                        // Generate JWT token for employee
                        var token = _jwtService.GenerateToken(employee);
                        
                        var response = new
                        {
                            success = true,
                            message = "Login successful",
                            user = new
                            {
                                id = employee.Id,
                                employeeId = employee.EmployeeId,
                                username = employee.Email,
                                email = employee.Email,
                                name = employee.Name,
                                role = employee.Role ?? "USER",
                                department = employee.Department,
                                designation = employee.Designation,
                                userType = "Employee"
                            },
                            token = token
                        };

                        _logger.LogInformation($"Employee {employee.Email} logged in successfully");
                        return Ok(response);
                    }
                }

                // Fallback to User table authentication
                var user = _userService.Authenticate(request);
                if (user != null)
                {
                    // Generate JWT token for user
                    var token = _jwtService.GenerateToken(user);
                    
                    var response = new
                    {
                        success = true,
                        message = "Login successful",
                        user = new
                        {
                            id = user.Id,
                            username = user.Username,
                            email = user.Email,
                            name = $"{user.FirstName} {user.LastName}".Trim(),
                            role = user.Role ?? "USER",
                            designation = "Employee",
                            userType = "User"
                        },
                        token = token
                    };

                    _logger.LogInformation($"User {user.Email} logged in successfully");
                    return Ok(response);
                }

                _logger.LogWarning($"Failed login attempt for username: {request.Username}");
                return Unauthorized(new { message = "Invalid credentials" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during login for username: {request?.Username}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            _logger.LogInformation($"Password change request received: {request?.Email}");
            
            if (request == null)
            {
                _logger.LogWarning("Password change request is null");
                return BadRequest(new { message = "Request data is required" });
            }

            _logger.LogInformation($"Password change request data - Email: {request.Email}, HasCurrentPassword: {!string.IsNullOrEmpty(request.CurrentPassword)}, HasNewPassword: {!string.IsNullOrEmpty(request.NewPassword)}");

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.CurrentPassword) || string.IsNullOrEmpty(request.NewPassword))
            {
                _logger.LogWarning($"Missing required fields - Email: {string.IsNullOrEmpty(request.Email)}, CurrentPassword: {string.IsNullOrEmpty(request.CurrentPassword)}, NewPassword: {string.IsNullOrEmpty(request.NewPassword)}");
                return BadRequest(new { message = "Email, current password, and new password are required" });
            }

            try
            {
                // Find the employee by email
                var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == request.Email);
                if (employee == null)
                {
                    _logger.LogWarning($"Employee not found with email: {request.Email}");
                    return NotFound(new { message = "Employee not found" });
                }

                _logger.LogInformation($"Found employee: {employee.Name} with email: {employee.Email}");

                // Verify the current password
                var passwordVerified = PasswordHelper.VerifyPassword(request.CurrentPassword, employee.Password);
                _logger.LogInformation($"Current password verification result: {passwordVerified}");
                
                if (!passwordVerified)
                {
                    _logger.LogWarning($"Current password is incorrect for user: {employee.Email}");
                    return BadRequest(new { message = "Current password is incorrect" });
                }

                // Hash the new password
                var hashedNewPassword = PasswordHelper.HashPassword(request.NewPassword);
                _logger.LogInformation($"New password hashed successfully for user: {employee.Email}");

                // Update the password
                employee.Password = hashedNewPassword;
                employee.UpdatedDate = DateTime.Now;

                var saveResult = await _context.SaveChangesAsync();
                _logger.LogInformation($"Database save changes result: {saveResult} rows affected");

                _logger.LogInformation($"Password changed successfully for user: {employee.Email}");

                return Ok(new { 
                    success = true, 
                    message = "Password changed successfully" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error changing password for user: {request.Email}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                // Since we're using stateless JWT tokens, logout is handled client-side
                // by clearing the token from localStorage
                _logger.LogInformation("User logged out successfully");
                
                return Ok(new
                {
                    success = true,
                    message = "Logged out successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "Logout failed", error = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.RefreshToken))
                {
                    return BadRequest(new { message = "Refresh token is required" });
                }

                // For this implementation, we'll generate a new token
                // In a production app, you'd validate the refresh token and get user info from it
                
                // For now, return an error since we don't have refresh token storage implemented
                return Unauthorized(new { 
                    success = false,
                    message = "Refresh token invalid or expired. Please login again." 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return StatusCode(500, new { message = "Token refresh failed", error = ex.Message });
            }
        }

        [HttpPost("validate")]
        public IActionResult ValidateToken([FromBody] ValidateTokenRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Token))
                {
                    return BadRequest(new { valid = false, message = "Token is required" });
                }

                // Validate the JWT token
                var isValid = _jwtService.ValidateToken(request.Token);
                
                return Ok(new
                {
                    valid = isValid,
                    message = isValid ? "Token is valid" : "Token is invalid or expired"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Ok(new { valid = false, message = "Token validation failed" });
            }
        }

        [HttpPost("debug-login")]
        public async Task<IActionResult> DebugLogin([FromBody] LoginRequest request)
        {
            try
            {
                // Find employee by email first
                var employee = await _context.Employees.FirstOrDefaultAsync(x => x.Email == request.Username);
                
                if (employee == null)
                {
                    return NotFound(new { 
                        message = "User not found", 
                        email = request.Username,
                        debug = "No employee found with this email address" 
                    });
                }

                // Check password hash
                var inputPasswordHash = PasswordHelper.HashPassword(request.Password);
                var storedPasswordHash = employee.Password;
                
                var response = new {
                    found = true,
                    email = employee.Email,
                    name = employee.Name,
                    role = employee.Role,
                    inputPassword = request.Password,
                    inputPasswordHash = inputPasswordHash,
                    storedPasswordHash = storedPasswordHash,
                    passwordsMatch = inputPasswordHash == storedPasswordHash,
                    message = inputPasswordHash == storedPasswordHash ? "Passwords match - login should work" : "Passwords don't match - login will fail"
                };
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Debug error", error = ex.Message });
            }
        }
    }

    public class ChangePasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class ValidateTokenRequest
    {
        public string Token { get; set; } = string.Empty;
    }
}
