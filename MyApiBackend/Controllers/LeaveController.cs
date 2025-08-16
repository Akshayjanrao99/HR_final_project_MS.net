using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApiBackend.Data;
using MyApiBackend.Models;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api/leave")]
    public class LeaveController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LeaveController> _logger;

        public LeaveController(AppDbContext context, ILogger<LeaveController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/leave/requests
        [HttpGet("requests")]
        public async Task<IActionResult> GetAllLeaveRequests()
        {
            try
            {
                var leaveRequests = await _context.LeaveRequests
                    .OrderByDescending(lr => lr.AddedDate)
                    .ToListAsync();

                return Ok(leaveRequests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching leave requests");
                return StatusCode(500, new { message = "Error fetching leave requests", error = ex.Message });
            }
        }

        // GET: api/leave/requests/user/{userId}
        [HttpGet("requests/user/{userId}")]
        public async Task<IActionResult> GetLeaveRequestsByUser(int userId)
        {
            try
            {
                var leaveRequests = await _context.LeaveRequests
                    .Where(lr => lr.ParentUkid == userId.ToString())
                    .OrderByDescending(lr => lr.AddedDate)
                    .ToListAsync();

                return Ok(leaveRequests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user leave requests");
                return StatusCode(500, new { message = "Error fetching user leave requests", error = ex.Message });
            }
        }

        // GET: api/leave/requests/{id}
        [HttpGet("requests/{id}")]
        public async Task<IActionResult> GetLeaveRequest(int id)
        {
            try
            {
                var leaveRequest = await _context.LeaveRequests
                    .FirstOrDefaultAsync(lr => lr.Id == id);

                if (leaveRequest == null)
                {
                    return NotFound(new { message = $"Leave request with ID {id} not found" });
                }

                return Ok(leaveRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching leave request");
                return StatusCode(500, new { message = "Error fetching leave request", error = ex.Message });
            }
        }

        // POST: api/leave/requests
        [HttpPost("requests")]
        public async Task<IActionResult> CreateLeaveRequest([FromBody] CreateLeaveRequestDto requestDto)
        {
            _logger.LogInformation("Received leave request creation attempt");
            
            if (requestDto == null)
            {
                _logger.LogWarning("Leave request DTO is null");
                return BadRequest(new { message = "Leave request data is required" });
            }

            // Log the received data for debugging
            _logger.LogInformation($"Leave request data: EmpName={requestDto.EmpName}, Subject={requestDto.Subject}, LeaveType={requestDto.LeaveType}, LeaveDays={requestDto.LeaveDays}");

            try
            {
                // Find employee by ParentUkid or by name
                Employee? employee = null;
                if (int.TryParse(requestDto.ParentUkid, out int employeeId))
                {
                    employee = await _context.Employees.FindAsync(employeeId);
                }

                if (employee == null && !string.IsNullOrEmpty(requestDto.EmpName))
                {
                    employee = await _context.Employees
                        .FirstOrDefaultAsync(e => e.Name.Contains(requestDto.EmpName));
                }

                // Combine leave type and reason into Text field since these columns don't exist in DB
                var textContent = $"{requestDto.LeaveType} leave: {requestDto.Text ?? requestDto.Reason}";
                
                var leaveRequest = new LeaveRequest
                {
                    EmpName = requestDto.EmpName,
                    Subject = requestDto.Subject,
                    Text = textContent,
                    ParentUkid = requestDto.ParentUkid,
                    Status = requestDto.Status ?? "PENDING",
                    AddedDate = requestDto.AddedDate != default ? requestDto.AddedDate : DateTime.Now,
                    LeaveDays = requestDto.LeaveDays
                };

                _context.LeaveRequests.Add(leaveRequest);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Leave request created with ID {leaveRequest.Id} for employee {requestDto.EmpName}");

                return Ok(new 
                { 
                    success = true,
                    message = "Leave request submitted successfully",
                    data = leaveRequest
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating leave request");
                return StatusCode(500, new { 
                    success = false,
                    message = "Error creating leave request", 
                    error = ex.Message 
                });
            }
        }

        // PUT: api/leave/requests/{id}/status
        [HttpPut("requests/{id}/status")]
        public async Task<IActionResult> UpdateLeaveRequestStatus(int id, [FromBody] UpdateStatusDto statusDto)
        {
            try
            {
                var leaveRequest = await _context.LeaveRequests.FindAsync(id);
                if (leaveRequest == null)
                {
                    return NotFound(new { message = $"Leave request with ID {id} not found" });
                }

                leaveRequest.Status = statusDto.Status;
                leaveRequest.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true,
                    message = $"Leave request status updated to {statusDto.Status}",
                    data = leaveRequest
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating leave request status");
                return StatusCode(500, new { message = "Error updating leave request status", error = ex.Message });
            }
        }

        // DELETE: api/leave/requests/{id}
        [HttpDelete("requests/{id}")]
        public async Task<IActionResult> DeleteLeaveRequest(int id)
        {
            try
            {
                var leaveRequest = await _context.LeaveRequests.FindAsync(id);
                if (leaveRequest == null)
                {
                    return NotFound(new { message = $"Leave request with ID {id} not found" });
                }

                _context.LeaveRequests.Remove(leaveRequest);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Leave request deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting leave request");
                return StatusCode(500, new { message = "Error deleting leave request", error = ex.Message });
            }
        }

        // GET: api/leave/summary/{employeeId}
        [HttpGet("summary/{employeeId}")]
        public async Task<IActionResult> GetLeaveSummary(int employeeId)
        {
            try
            {
                var currentYear = DateTime.Now.Year;
                var leaveRequests = await _context.LeaveRequests
                    .Where(lr => lr.ParentUkid == employeeId.ToString() 
                                && lr.AddedDate.Year == currentYear)
                    .ToListAsync();

                var summary = new
                {
                    pending = leaveRequests.Count(lr => lr.Status.ToUpper() == "PENDING"),
                    approved = leaveRequests.Count(lr => lr.Status.ToUpper() == "APPROVED"),
                    canceled = leaveRequests.Count(lr => lr.Status.ToUpper() == "CANCELLED"),
                    denied = leaveRequests.Count(lr => lr.Status.ToUpper() == "REJECTED" || lr.Status.ToUpper() == "DENIED"),
                    total = leaveRequests.Count,
                    remaining = Math.Max(0, 30 - leaveRequests.Where(lr => lr.Status.ToUpper() == "APPROVED").Sum(lr => lr.LeaveDays))
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching leave summary");
                return StatusCode(500, new { message = "Error fetching leave summary", error = ex.Message });
            }
        }

        // GET: api/leave/balance/{employeeId}
        [HttpGet("balance/{employeeId}")]
        public async Task<IActionResult> GetLeaveBalance(int employeeId)
        {
            try
            {
                var currentYear = DateTime.Now.Year;
                var approvedLeaves = await _context.LeaveRequests
                    .Where(lr => lr.ParentUkid == employeeId.ToString()
                                && lr.Status.ToUpper() == "APPROVED"
                                && lr.AddedDate.Year == currentYear)
                    .SumAsync(lr => lr.LeaveDays);

                var balance = new
                {
                    totalAllowed = 30,
                    used = approvedLeaves,
                    remaining = Math.Max(0, 30 - approvedLeaves),
                    year = currentYear
                };

                return Ok(balance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching leave balance");
                return StatusCode(500, new { message = "Error fetching leave balance", error = ex.Message });
            }
        }

        // GET: api/leave/types
        [HttpGet("types")]
        public IActionResult GetLeaveTypes()
        {
            var leaveTypes = new[]
            {
                new { value = "sick", label = "Sick Leave", maxDays = 12 },
                new { value = "casual", label = "Casual Leave", maxDays = 8 },
                new { value = "annual", label = "Annual Leave", maxDays = 10 },
                new { value = "emergency", label = "Emergency Leave", maxDays = 5 },
                new { value = "maternity", label = "Maternity Leave", maxDays = 90 },
                new { value = "paternity", label = "Paternity Leave", maxDays = 15 },
                new { value = "other", label = "Other", maxDays = 5 }
            };

            return Ok(leaveTypes);
        }
        
        // POST: api/leave/debug
        [HttpPost("debug")]
        public IActionResult DebugLeaveRequest([FromBody] object requestData)
        {
            try
            {
                _logger.LogInformation($"Raw JSON received: {System.Text.Json.JsonSerializer.Serialize(requestData)}");
                return Ok(new { 
                    message = "Debug successful", 
                    receivedData = requestData,
                    timestamp = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in debug endpoint");
                return StatusCode(500, new { message = "Debug error", error = ex.Message });
            }
        }
    }

    // DTOs for request/response
    public class CreateLeaveRequestDto
    {
        public string EmpName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string ParentUkid { get; set; } = string.Empty;
        public string Status { get; set; } = "PENDING";
        public DateTime AddedDate { get; set; } = DateTime.Now;
        public int LeaveDays { get; set; }
        public string Position { get; set; } = string.Empty;
        public string LeaveType { get; set; } = "sick";
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
