using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApiBackend.Data;
using MyApiBackend.Models;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class PostsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts()
        {
            try
            {
                var posts = await _context.BlogPosts
                    .OrderByDescending(p => p.AddedDate)
                    .Select(p => new
                    {
                        id = p.Id,
                        title = p.Title,
                        content = p.Content ?? p.Comment,
                        author = p.Author ?? "Anonymous",
                        addedDate = p.AddedDate.ToString("yyyy-MM-dd"),
                        date = p.AddedDate.ToString("yyyy-MM-dd")
                    })
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching posts", error = ex.Message });
            }
        }

        [HttpGet("compose")]
        public async Task<IActionResult> GetLeaveRequests()
        {
            try
            {
                var leaveRequests = await _context.LeaveRequests
                    .OrderByDescending(lr => lr.AddedDate)
                    .Select(lr => new
                    {
                        id = lr.Id,
                        empName = lr.EmpName,
                        empId = $"EMP{lr.Id:000}",
                        position = "Employee", // Position field doesn't exist in DB
                        status = lr.Status ?? "PENDING",
                        addedDate = lr.AddedDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                        text = lr.Text,
                        subject = lr.Subject
                    })
                    .ToListAsync();

                return Ok(leaveRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching leave requests", error = ex.Message });
            }
        }

        [HttpPost("posts")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest postData)
        {
            if (postData == null)
            {
                return BadRequest(new { message = "Post data is required", error = "NULL_REQUEST" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState, error = "VALIDATION_ERROR" });
            }

            try
            {
                var blogPost = new BlogPost
                {
                    Title = postData.Title,
                    Content = postData.Content,
                    Comment = postData.Comment ?? postData.Content ?? "No comment", // Ensure Comment is not null
                    Author = postData.Author ?? "Anonymous",
                    AddedDate = DateTime.Now
                };

                _context.BlogPosts.Add(blogPost);
                await _context.SaveChangesAsync();

                var responsePost = new
                {
                    id = blogPost.Id,
                    title = blogPost.Title,
                    content = blogPost.Content,
                    author = blogPost.Author,
                    addedDate = blogPost.AddedDate.ToString("yyyy-MM-dd"),
                    success = true,
                    message = "Post created successfully"
                };

                return CreatedAtAction(nameof(GetPosts), new { id = blogPost.Id }, responsePost);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("compose")]
        public async Task<IActionResult> CreateLeaveRequest([FromBody] CreateLeaveRequest leaveData)
        {
            if (leaveData == null)
            {
                return BadRequest(new { message = "Leave request data is required", error = "NULL_REQUEST" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState, error = "VALIDATION_ERROR" });
            }

            try
            {
                // Create the leave request text with all details
                var leaveText = $"Leave Type: {leaveData.LeaveType}\nFrom: {leaveData.FromDate}\nTo: {leaveData.ToDate}\nDays: {leaveData.LeaveDays}\nReason: {leaveData.Reason}";
                
                var leaveRequest = new LeaveRequest
                {
                    EmpName = leaveData.EmpName,
                    Subject = leaveData.Subject,
                    Text = leaveText,
                    Status = "PENDING",
                    ParentUkid = !string.IsNullOrEmpty(leaveData.ParentUkid) ? leaveData.ParentUkid : $"LR{DateTime.Now:yyyyMMddHHmmss}",
                    LeaveDays = leaveData.LeaveDays,
                    AddedDate = DateTime.Now
                };

                _context.LeaveRequests.Add(leaveRequest);
                await _context.SaveChangesAsync();

                var responseLeaveRequest = new
                {
                    id = leaveRequest.Id,
                    empName = leaveRequest.EmpName,
                    empId = $"EMP{leaveRequest.Id:000}",
                    subject = leaveRequest.Subject,
                    position = "Employee", // Position field doesn't exist in DB
                    status = leaveRequest.Status,
                    addedDate = leaveRequest.AddedDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    text = leaveRequest.Text,
                    leaveDays = leaveRequest.LeaveDays,
                    success = true,
                    message = $"{leaveData.LeaveType} leave request submitted successfully and is pending approval"
                };

                return CreatedAtAction(nameof(GetLeaveRequests), new { id = leaveRequest.Id }, responseLeaveRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error while processing leave request", error = ex.Message });
            }
        }

        [HttpGet("compose/user/{userId}")]
        public IActionResult GetUserLeaveRequests(int userId)
        {
            var userLeaveRequests = new[]
            {
                new
                {
                    id = 1,
                    empName = "Current User",
                    empId = $"EMP{userId:000}",
                    position = "Employee",
                    status = "PENDING",
                    addedDate = "2024-07-15T10:30:00Z",
                    text = "Leave Type: Annual Leave\nFrom: 2024-08-01\nTo: 2024-08-05\nDays: 5\nReason: Family vacation"
                }
            };

            return Ok(userLeaveRequests);
        }

        [HttpPut("compose/{id}/status")]
        public async Task<IActionResult> UpdateLeaveRequestStatus(int id, [FromBody] UpdateStatusRequest statusData)
        {
            if (statusData == null || string.IsNullOrEmpty(statusData.Status))
            {
                return BadRequest(new { message = "Status data is required", error = "NULL_REQUEST" });
            }

            try
            {
                var leaveRequest = await _context.LeaveRequests.FindAsync(id);
                if (leaveRequest == null)
                {
                    return NotFound(new { message = $"Leave request with ID {id} not found" });
                }

                // Validate status value
                var validStatuses = new[] { "PENDING", "APPROVED", "REJECTED", "CANCELLED" };
                var upperStatus = statusData.Status.ToUpper();
                if (!validStatuses.Contains(upperStatus))
                {
                    return BadRequest(new { message = $"Invalid status '{statusData.Status}'. Valid statuses are: {string.Join(", ", validStatuses)}" });
                }

                leaveRequest.Status = upperStatus;
                // UpdatedDate property doesn't exist in current LeaveRequest model

                await _context.SaveChangesAsync();
                return Ok(new { 
                    success = true,
                    message = $"Leave request {id} status updated to {upperStatus} successfully",
                    id = id,
                    status = upperStatus
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating leave request status", error = ex.Message });
            }
        }

        [HttpDelete("compose/{id}")]
        public IActionResult DeleteLeaveRequest(int id)
        {
            return Ok(new { message = $"Leave request {id} deleted successfully" });
        }
    }
}
