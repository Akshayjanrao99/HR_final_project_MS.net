using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApiBackend.Models
{
    public class Payroll
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [DataType(DataType.Currency)]
        public decimal BasicSalary { get; set; }

        [DataType(DataType.Currency)]
        public decimal HouseRentAllowance { get; set; }

        [DataType(DataType.Currency)]
        public decimal MedicalAllowance { get; set; }

        [DataType(DataType.Currency)]
        public decimal ConveyanceAllowance { get; set; }

        [DataType(DataType.Currency)]
        public decimal OtherAllowances { get; set; }

        [DataType(DataType.Currency)]
        public decimal ProvidentFund { get; set; }

        [DataType(DataType.Currency)]
        public decimal ProfessionalTax { get; set; }

        [DataType(DataType.Currency)]
        public decimal IncomeTax { get; set; }

        [DataType(DataType.Currency)]
        public decimal OtherDeductions { get; set; }

        [DataType(DataType.Currency)]
        public decimal GrossSalary { get; set; }

        [DataType(DataType.Currency)]
        public decimal NetSalary { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public int WorkingDays { get; set; }

        public int PresentDays { get; set; }

        public int LeaveDays { get; set; }

        public string Status { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime UpdatedDate { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee Employee { get; set; }

        // Calculation methods
        public void CalculatePayroll()
        {
            GrossSalary = BasicSalary + HouseRentAllowance + MedicalAllowance + ConveyanceAllowance + OtherAllowances;
            NetSalary = GrossSalary - (ProvidentFund + ProfessionalTax + IncomeTax + OtherDeductions);
        }

        public decimal CalculateIncomeTax()
        {
            decimal annualSalary = GrossSalary * 12;
            decimal tax = 0;

            if (annualSalary > 250000)
            {
                if (annualSalary <= 500000)
                {
                    tax = (annualSalary - 250000) * 0.05m;
                }
                else if (annualSalary <= 1000000)
                {
                    tax = 12500 + (annualSalary - 500000) * 0.20m;
                }
                else
                {
                    tax = 112500 + (annualSalary - 1000000) * 0.30m;
                }
            }

            return tax / 12; // Monthly tax
        }
    }
}
