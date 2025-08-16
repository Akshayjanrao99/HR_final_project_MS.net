using System;
using System.ComponentModel.DataAnnotations;

namespace MyApiBackend.Models
{
    public class CreateEmployeeRequest
    {
        [Required]
        [StringLength(100)]
        public string EmployeeName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Gender { get; set; }

        public string? DateOfBirth { get; set; }

        public string? JoinDate { get; set; }

        public string? ContactNumber { get; set; }

        public string? AadhaarNumber { get; set; }

        public string? AccountNumber { get; set; }

        public string? Department { get; set; }

        public string? Designation { get; set; }

        public string? Address { get; set; }

        public string? PermanentAddress { get; set; }

        public string? PreviousCompany { get; set; }

        public string? PfNumber { get; set; }

        [DataType(DataType.Currency)]
        public decimal Salary { get; set; }

        public string? Role { get; set; }

        public bool? Active { get; set; }
    }
}
