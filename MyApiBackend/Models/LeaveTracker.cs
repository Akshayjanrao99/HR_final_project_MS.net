using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApiBackend.Models
{
    public class LeaveTracker
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        public int TotalLeaves { get; set; }

        public int UsedLeaves { get; set; }

        [NotMapped]
        public int AvailableLeaves => TotalLeaves - UsedLeaves;

        [ForeignKey("EmployeeId")]
        public Employee Employee { get; set; }
    }
}
