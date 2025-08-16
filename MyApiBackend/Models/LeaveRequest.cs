using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApiBackend.Models
{
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string EmpName { get; set; } = string.Empty;

        public string Subject { get; set; } = string.Empty;

        public string Text { get; set; } = string.Empty;

        public string ParentUkid { get; set; } = string.Empty;

        public string Status { get; set; } = "PENDING";

        [DataType(DataType.Date)]
        public DateTime AddedDate { get; set; } = DateTime.Now;

        public int LeaveDays { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; } = DateTime.Now;
        
        // Only include fields that exist in the actual database
        // Based on migration file, CreatedDate and UpdatedDate columns exist
        // Using Text field to store both leave type and reason
    }
}
