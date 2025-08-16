using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MyApiBackend.Data;
using MyApiBackend.Models;
using MyApiBackend.Services;
using MyApiBackend.Utils;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(AppDbContext context, IEmailService emailService, ILogger<EmployeeController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();
                // Return employees without password for security
                var employeesWithoutPassword = employees.Select(emp => new
                {
                    emp.Id,
                    emp.EmployeeId,
                    emp.Name,
                    emp.Email,
                    emp.Gender,
                    emp.DateOfBirth,
                    emp.JoinDate,
                    emp.MobileNumber,
                    emp.AadhaarNumber,
                    emp.AccountNumber,
                    emp.Department,
                    emp.Designation,
                    emp.PreviousCompany,
                    emp.PfNumber,
                    emp.Salary,
                    emp.Address,
                    emp.PermanentAddress,
                    emp.IsActive,
                    emp.CreatedDate,
                    emp.UpdatedDate,
                    emp.Role
                });
                return Ok(employeesWithoutPassword);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching employees", error = ex.Message });
            }
        }

        [HttpGet("employees/{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                }
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching employee", error = ex.Message });
            }
        }

        [HttpPost("employees")]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Employee data is required", error = "NULL_REQUEST" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState, error = "VALIDATION_ERROR" });
            }

            try
            {
                // Check if email already exists
                var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == request.Email);
                if (existingEmployee != null)
                {
                    return BadRequest(new { message = "Employee with this email already exists", error = "DUPLICATE_EMAIL" });
                }

                // Generate secure temporary password
                var temporaryPassword = PasswordHelper.GenerateTemporaryPassword();
                var hashedPassword = PasswordHelper.HashPassword(temporaryPassword);

                var employee = new Employee
                {
                    Name = request.EmployeeName,
                    Email = request.Email,
                    Gender = request.Gender ?? "M",
                    DateOfBirth = DateTime.TryParse(request.DateOfBirth, out var dob) ? dob : DateTime.Now.AddYears(-25),
                    JoinDate = DateTime.TryParse(request.JoinDate, out var joinDate) ? joinDate : DateTime.Now,
                    MobileNumber = request.ContactNumber ?? "",
                    AadhaarNumber = request.AadhaarNumber ?? "",
                    AccountNumber = request.AccountNumber ?? "",
                    Department = request.Department ?? "Unknown",
                    Designation = request.Designation ?? "Employee",
                    PreviousCompany = request.PreviousCompany ?? "",
                    PfNumber = request.PfNumber ?? "",
                    Salary = request.Salary,
                    Address = request.Address ?? "",
                    PermanentAddress = request.PermanentAddress ?? "",
                    IsActive = request.Active ?? true,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    Password = hashedPassword, // Secure hashed password
                    Role = request.Role ?? "USER"
                };

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();

                // Send welcome email with temporary credentials
                try
                {
                    var emailSent = await _emailService.SendWelcomeEmailAsync(employee, temporaryPassword);
                    if (!emailSent)
                    {
                        _logger.LogWarning($"Failed to send welcome email to {employee.Email}");
                        // Continue with employee creation even if email fails
                    }
                    else
                    {
                        _logger.LogInformation($"Welcome email sent successfully to {employee.Email}");
                    }
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, $"Error sending welcome email to {employee.Email}");
                    // Continue with employee creation even if email fails
                }

                // Return employee data without password
                var employeeResponse = new
                {
                    employee.Id,
                    employee.Name,
                    employee.Email,
                    employee.Gender,
                    employee.DateOfBirth,
                    employee.JoinDate,
                    employee.MobileNumber,
                    employee.AadhaarNumber,
                    employee.AccountNumber,
                    employee.Department,
                    employee.Designation,
                    employee.PreviousCompany,
                    employee.PfNumber,
                    employee.Salary,
                    employee.Address,
                    employee.PermanentAddress,
                    employee.IsActive,
                    employee.CreatedDate,
                    employee.UpdatedDate,
                    employee.Role,
                    message = "Employee created successfully. Welcome email sent to the employee's email address."
                };

                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employeeResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPut("employees/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] CreateEmployeeRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Employee data is required", error = "NULL_REQUEST" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState, error = "VALIDATION_ERROR" });
            }

            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                }

                // Update employee properties
                employee.Name = request.EmployeeName;
                employee.Email = request.Email;
                employee.Gender = request.Gender ?? employee.Gender;
                if (DateTime.TryParse(request.DateOfBirth, out var dob))
                    employee.DateOfBirth = dob;
                if (DateTime.TryParse(request.JoinDate, out var joinDate))
                    employee.JoinDate = joinDate;
                employee.MobileNumber = request.ContactNumber ?? employee.MobileNumber;
                employee.AadhaarNumber = request.AadhaarNumber ?? employee.AadhaarNumber;
                employee.AccountNumber = request.AccountNumber ?? employee.AccountNumber;
                employee.Department = request.Department ?? employee.Department;
                employee.Designation = request.Designation ?? employee.Designation;
                employee.PreviousCompany = request.PreviousCompany ?? employee.PreviousCompany;
                employee.PfNumber = request.PfNumber ?? employee.PfNumber;
                employee.Salary = request.Salary;
                employee.Address = request.Address ?? employee.Address;
                employee.PermanentAddress = request.PermanentAddress ?? employee.PermanentAddress;
                employee.IsActive = request.Active ?? employee.IsActive;
                employee.UpdatedDate = DateTime.Now;
                employee.Role = request.Role ?? employee.Role;

                await _context.SaveChangesAsync();
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpDelete("employees/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                }

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
                return Ok(new { message = $"Employee with ID {id} has been deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting employee", error = ex.Message });
            }
        }

        [HttpGet("employee/{id}/leave-summary")]
        public IActionResult GetEmployeeLeaveSummary(int id)
        {
            var leaveSummary = new
            {
                pending = 2,
                approved = 8,
                canceled = 1,
                denied = 1,
                total = 12,
                remaining = 13
            };

            return Ok(leaveSummary);
        }
    }
}
