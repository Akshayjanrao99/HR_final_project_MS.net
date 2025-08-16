using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApiBackend.Data;
using MyApiBackend.Models;

namespace MyApiBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class PayrollController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PayrollController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("payroll/current-month")]
        public IActionResult GetCurrentMonthPayroll()
        {
            var payrollData = new
            {
                month = DateTime.Now.ToString("MMMM yyyy"),
                totalEmployees = 150,
                totalPayroll = 875000,
                averageSalary = 5833,
                payrollDetails = new[]
                {
                    new 
                    { 
                        employeeId = 1, 
                        name = "John Doe", 
                        baseSalary = 85000, 
                        bonuses = 2500, 
                        deductions = 1200, 
                        netPay = 86300,
                        payDate = "2024-07-31"
                    },
                    new 
                    { 
                        employeeId = 2, 
                        name = "Jane Smith", 
                        baseSalary = 75000, 
                        bonuses = 1500, 
                        deductions = 1100, 
                        netPay = 75400,
                        payDate = "2024-07-31"
                    },
                    new 
                    { 
                        employeeId = 3, 
                        name = "Mike Johnson", 
                        baseSalary = 60000, 
                        bonuses = 1000, 
                        deductions = 900, 
                        netPay = 60100,
                        payDate = "2024-07-31"
                    }
                }
            };

            return Ok(payrollData);
        }

        [HttpGet("payrolls")]
        public async Task<IActionResult> GetAllPayrolls()
        {
            try
            {
                var payrolls = await _context.Payrolls
                    .Include(p => p.Employee)
                    .OrderByDescending(p => p.CreatedDate)
                    .Select(p => new {
                        p.Id,
                        p.EmployeeId,
                        employeeName = p.Employee.Name,
                        department = p.Employee.Department,
                        p.Month,
                        p.Year,
                        p.GrossSalary,
                        totalDeductions = p.ProvidentFund + p.ProfessionalTax + p.IncomeTax + p.OtherDeductions,
                        p.NetSalary,
                        p.Status,
                        p.CreatedDate
                    })
                    .ToListAsync();
                return Ok(payrolls);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching payrolls", error = ex.Message });
            }
        }

        [HttpGet("payroll/employees")]
        public async Task<IActionResult> GetEmployeesForPayroll()
        {
            try
            {
                var employees = await _context.Employees
                    .Where(e => e.IsActive && e.Role != "ADMIN")
                    .Select(e => new
                    {
                        id = e.Id,
                        name = e.Name,
                        position = e.Designation,
                        department = e.Department,
                        salary = e.Salary
                    })
                    .ToListAsync();

                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching employees", error = ex.Message });
            }
        }

        [HttpGet("payroll/{id}")]
        public async Task<IActionResult> GetPayrollById(int id)
        {
            try
            {
                var payroll = await _context.Payrolls
                    .Include(p => p.Employee)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (payroll == null)
                {
                    return NotFound(new { message = $"Payroll with ID {id} not found" });
                }

                var payrollDetails = new {
                    payroll.Id,
                    payroll.EmployeeId,
                    employeeName = payroll.Employee.Name,
                    department = payroll.Employee.Department,
                    designation = payroll.Employee.Designation,
                    payroll.Month,
                    payroll.Year,
                    payroll.WorkingDays,
                    payroll.PresentDays,
                    basicSalary = payroll.BasicSalary,
                    hra = payroll.HouseRentAllowance,
                    da = 0m, // DA is not stored in the database
                    conveyanceAllowance = payroll.ConveyanceAllowance,
                    medicalAllowance = payroll.MedicalAllowance,
                    specialAllowance = payroll.OtherAllowances,
                    pfDeduction = payroll.ProvidentFund,
                    esiDeduction = 0m, // ESI is not stored in the database
                    professionalTax = payroll.ProfessionalTax,
                    incomeTax = payroll.IncomeTax,
                    insuranceDeduction = 0m, // Insurance is not stored in the database
                    grossSalary = payroll.GrossSalary,
                    totalDeductions = payroll.ProvidentFund + payroll.ProfessionalTax + payroll.IncomeTax + payroll.OtherDeductions,
                    netSalary = payroll.NetSalary,
                    status = payroll.Status
                };

                return Ok(payrollDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching payroll details", error = ex.Message });
            }
        }

        [HttpGet("payroll/employee/{id}")]
        public async Task<IActionResult> GetEmployeePayroll(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                }

                // Generate payroll data based on employee's salary
                var baseSalary = employee.Salary;
                var hra = baseSalary * 0.40m; // 40% HRA
                var medicalAllowance = 2000;
                var conveyanceAllowance = 1600;
                var grossPay = baseSalary + hra + medicalAllowance + conveyanceAllowance;
                
                var pfDeduction = baseSalary * 0.12m; // 12% PF
                var professionalTax = 200;
                var incomeTax = grossPay * 0.10m; // 10% income tax (simplified)
                var totalDeductions = pfDeduction + professionalTax + incomeTax;
                var netPay = grossPay - totalDeductions;

                var employeePayroll = new
                {
                    employeeId = id,
                    empName = employee.Name,
                    position = employee.Designation,
                    department = employee.Department,
                    payPeriod = DateTime.Now.ToString("MMMM yyyy"),
                    basicSalary = baseSalary,
                    houseRentAllowance = hra,
                    medicalAllowance = medicalAllowance,
                    conveyanceAllowance = conveyanceAllowance,
                    grossPay = grossPay,
                    deductions = new
                    {
                        providentFund = pfDeduction,
                        professionalTax = professionalTax,
                        incomeTax = incomeTax,
                        total = totalDeductions
                    },
                    netPay = netPay,
                    payDate = DateTime.Now.ToString("yyyy-MM-dd"),
                    workingDays = 22,
                    presentDays = 22,
                    leaveDays = 0
                };

                return Ok(employeePayroll);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating payroll data", error = ex.Message });
            }
        }

        [HttpPost("payroll/generate")]
        public async Task<IActionResult> GeneratePayrollForEmployee([FromBody] PayrollGenerationRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Payroll data is required" });
            }

            // Validate required fields
            if (request.EmployeeId <= 0)
            {
                return BadRequest(new { message = "EmployeeId is required and must be greater than 0" });
            }

            // Check if employee exists
            var employee = await _context.Employees.FindAsync(request.EmployeeId);
            if (employee == null)
            {
                return BadRequest(new { message = $"Employee with ID {request.EmployeeId} not found" });
            }

            try
            {
                // Map DTO to Payroll entity
                var payroll = new Payroll
                {
                    EmployeeId = request.EmployeeId,
                    BasicSalary = request.BasicSalary,
                    HouseRentAllowance = request.HouseRentAllowance,
                    MedicalAllowance = request.MedicalAllowance,
                    ConveyanceAllowance = request.ConveyanceAllowance,
                    OtherAllowances = request.OtherAllowances,
                    ProvidentFund = request.ProvidentFund,
                    ProfessionalTax = request.ProfessionalTax,
                    IncomeTax = request.IncomeTax,
                    OtherDeductions = request.OtherDeductions,
                    GrossSalary = request.GrossSalary,
                    NetSalary = request.NetSalary,
                    Month = request.Month,
                    Year = request.Year,
                    WorkingDays = request.WorkingDays,
                    PresentDays = request.PresentDays,
                    LeaveDays = request.LeaveDays,
                    Status = string.IsNullOrEmpty(request.Status) ? "Generated" : request.Status,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };

                _context.Payrolls.Add(payroll);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    message = "Payroll generated and saved successfully",
                    payrollId = payroll.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving payroll data", error = ex.Message, innerException = ex.InnerException?.Message });
            }
        }

        [HttpPost("payroll/generate-all")]
        public IActionResult GeneratePayrollForAll()
        {
            var result = new
            {
                message = "Payroll generated successfully for all employees",
                totalEmployees = 150,
                totalAmount = 875000,
                generatedDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            };

            return Ok(result);
        }

        [HttpGet("payroll/statistics")]
        public IActionResult GetPayrollStatistics()
        {
            var statistics = new
            {
                totalEmployees = 150,
                totalPayroll = 875000,
                averageSalary = 5833,
                highestPaid = 120000,
                lowestPaid = 35000,
                totalDeductions = 45000,
                totalBonuses = 125000
            };

            return Ok(statistics);
        }

        [HttpPut("payroll/approve/{id}")]
        public IActionResult ApprovePayroll(int id)
        {
            return Ok(new { message = $"Payroll {id} approved successfully" });
        }

        [HttpPut("payroll/pay/{id}")]
        public IActionResult MarkAsPaid(int id)
        {
            return Ok(new { message = $"Payroll {id} marked as paid successfully" });
        }

        [HttpDelete("payroll/{id}")]
        public IActionResult DeletePayroll(int id)
        {
            return Ok(new { message = $"Payroll {id} deleted successfully" });
        }
    }
}
