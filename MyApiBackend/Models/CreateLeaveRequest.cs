using System.ComponentModel.DataAnnotations;

namespace MyApiBackend.Models
{
    public class CreateLeaveRequest
    {
        [Required]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public string LeaveType { get; set; } = string.Empty;
        
        [Required]
        public string FromDate { get; set; } = string.Empty;
        
        [Required]
        public string ToDate { get; set; } = string.Empty;
        
        [Required]
        public int LeaveDays { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        [Required]
        public string EmpName { get; set; } = string.Empty;
        
        public string ParentUkid { get; set; } = string.Empty;
        
        public string Position { get; set; } = "Employee";
        
        public string Status { get; set; } = "PENDING";
    }
}
