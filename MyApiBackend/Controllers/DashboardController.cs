using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApiBackend.Data;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(AppDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var totalEmployees = await _context.Employees.CountAsync();
                var activeEmployees = await _context.Employees.CountAsync(e => e.IsActive);
                var pendingLeaveRequests = await _context.LeaveRequests.CountAsync(lr => lr.Status.ToUpper() == "PENDING");
                var approvedLeaveRequests = await _context.LeaveRequests.CountAsync(lr => lr.Status.ToUpper() == "APPROVED");
                var totalBlogPosts = await _context.BlogPosts.CountAsync();

                var stats = new
                {
                    totalEmployees,
                    activeEmployees,
                    totalDepartments = 6,
                    pendingLeaveRequests,
                    approvedLeaveRequests,
                    totalBlogPosts,
                    timestamp = DateTime.UtcNow
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard stats");
                return StatusCode(500, new { message = "Error retrieving dashboard statistics", error = ex.Message });
            }
        }

        [HttpGet("department-summary")]
        public async Task<IActionResult> GetDepartmentSummary()
        {
            try
            {
                var departmentGroups = await _context.Employees
                    .Where(e => e.IsActive)
                    .GroupBy(e => e.Department)
                    .Select(g => new { Department = g.Key, Count = g.Count() })
                    .ToListAsync();

                var departmentSummary = new Dictionary<string, int>();
                
                foreach (var group in departmentGroups)
                {
                    var departmentKey = group.Department.ToLower().Replace(" ", "");
                    departmentSummary[departmentKey] = group.Count;
                }

                // Ensure all expected departments exist (with 0 if no employees)
                var expectedDepartments = new[] { "development", "qatesting", "networking", "hrteam", "security", "sealsmarket" };
                foreach (var dept in expectedDepartments)
                {
                    if (!departmentSummary.ContainsKey(dept))
                    {
                        departmentSummary[dept] = 0;
                    }
                }

                return Ok(departmentSummary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting department summary");
                return StatusCode(500, new { message = "Error retrieving department summary", error = ex.Message });
            }
        }

        [HttpGet("test")]
        public IActionResult TestConnection()
        {
            var response = new
            {
                success = true,
                message = "Backend connection successful!",
                timestamp = DateTime.UtcNow,
                status = "OK"
            };

            return Ok(response);
        }

        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            try
            {
                // Get recent leave requests
                var recentLeaveRequests = await _context.LeaveRequests
                    .OrderByDescending(lr => lr.AddedDate)
                    .Take(5)
                    .Select(lr => new
                    {
                        activity = $"Leave request {lr.Status.ToLower()} for {lr.EmpName}",
                        timestamp = lr.AddedDate,
                        type = "leave"
                    })
                    .ToListAsync();

                // Get recent blog posts
                var recentPosts = await _context.BlogPosts
                    .OrderByDescending(bp => bp.AddedDate)
                    .Take(3)
                    .Select(bp => new
                    {
                        activity = $"New blog post: {bp.Title}",
                        timestamp = bp.AddedDate,
                        type = "blog"
                    })
                    .ToListAsync();

                // Combine and sort all activities
                var allActivities = recentLeaveRequests.Concat(recentPosts)
                    .OrderByDescending(a => a.timestamp)
                    .Take(10)
                    .ToList();

                return Ok(allActivities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activities");
                return StatusCode(500, new { message = "Error retrieving recent activities", error = ex.Message });
            }
        }

        [HttpGet("leave-statistics")]
        public async Task<IActionResult> GetLeaveStatistics()
        {
            try
            {
                var currentYear = DateTime.Now.Year;
                var currentMonth = DateTime.Now.Month;

                var leaveStats = new
                {
                    totalRequests = await _context.LeaveRequests.CountAsync(lr => lr.AddedDate.Year == currentYear),
                    pendingRequests = await _context.LeaveRequests.CountAsync(lr => lr.Status.ToUpper() == "PENDING" && lr.AddedDate.Year == currentYear),
                    approvedRequests = await _context.LeaveRequests.CountAsync(lr => lr.Status.ToUpper() == "APPROVED" && lr.AddedDate.Year == currentYear),
                    rejectedRequests = await _context.LeaveRequests.CountAsync(lr => lr.Status.ToUpper() == "REJECTED" && lr.AddedDate.Year == currentYear),
                    thisMonthRequests = await _context.LeaveRequests.CountAsync(lr => lr.AddedDate.Year == currentYear && lr.AddedDate.Month == currentMonth),
                    totalLeaveDays = await _context.LeaveRequests
                        .Where(lr => lr.Status.ToUpper() == "APPROVED" && lr.AddedDate.Year == currentYear)
                        .SumAsync(lr => lr.LeaveDays),
                    averageLeaveDays = await _context.LeaveRequests
                        .Where(lr => lr.Status.ToUpper() == "APPROVED" && lr.AddedDate.Year == currentYear)
                        .AverageAsync(lr => (double?)lr.LeaveDays) ?? 0,
                    year = currentYear
                };

                return Ok(leaveStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting leave statistics");
                return StatusCode(500, new { message = "Error retrieving leave statistics", error = ex.Message });
            }
        }

        [HttpGet("employee-performance")]
        public async Task<IActionResult> GetEmployeePerformance()
        {
            try
            {
                var currentYear = DateTime.Now.Year;

                // Get employee performance data based on leave usage
                var performanceData = await _context.Employees
                    .Where(e => e.IsActive)
                    .Select(e => new
                    {
                        employeeName = e.Name,
                        department = e.Department,
                        totalLeavesTaken = _context.LeaveRequests
                            .Where(lr => lr.ParentUkid == e.Id.ToString() && lr.Status.ToUpper() == "APPROVED" && lr.AddedDate.Year == currentYear)
                            .Sum(lr => lr.LeaveDays),
                        leaveRequestsCount = _context.LeaveRequests
                            .Count(lr => lr.ParentUkid == e.Id.ToString() && lr.AddedDate.Year == currentYear),
                        joinDate = e.JoinDate,
                        designation = e.Designation
                    })
                    .Take(20)
                    .ToListAsync();

                return Ok(performanceData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee performance");
                return StatusCode(500, new { message = "Error retrieving employee performance", error = ex.Message });
            }
        }
    }
}
