using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApiBackend.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        
        // Computed property for display purposes (not stored in database)
        [NotMapped]
        public string EmployeeId => $"EMP{Id:000}";
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Gender { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [DataType(DataType.Date)]
        public DateTime JoinDate { get; set; }

        [Phone]
        public string MobileNumber { get; set; }

        public string AadhaarNumber { get; set; }

        public string AccountNumber { get; set; }

        public string Department { get; set; }

        public string Designation { get; set; }

        public string PreviousCompany { get; set; }

        public string PfNumber { get; set; }

        [DataType(DataType.Currency)]
        public decimal Salary { get; set; }

        public string Address { get; set; }

        public string PermanentAddress { get; set; }

        public ICollection<Address> Addresses { get; set; }

        public bool IsActive { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; }

        [Required]
        public string Password { get; set; }

        public string Role { get; set; }
    }

    public class Address
    {
        [Key]
        public int Id { get; set; }

        public string Street { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }

        public int EmployeeId { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee Employee { get; set; }
    }
}

