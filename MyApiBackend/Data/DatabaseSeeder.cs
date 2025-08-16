using Microsoft.EntityFrameworkCore;
using MyApiBackend.Models;
using MyApiBackend.Utils;

namespace MyApiBackend.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAdminUser(AppDbContext context)
        {
            // Admin 1: Default system admin
            var existingAdmin1 = await context.Employees
                .FirstOrDefaultAsync(e => e.Email == "admin@company.com");

            var adminPassword1 = "admin123";
            var hashedAdminPassword1 = PasswordHelper.HashPassword(adminPassword1);

            if (existingAdmin1 != null)
            {
                // Update existing admin with hashed password
                existingAdmin1.Password = hashedAdminPassword1;
                existingAdmin1.Name = "Admin User";
                existingAdmin1.UpdatedDate = DateTime.Now;
                Console.WriteLine("Updated existing admin user (admin@company.com)");
            }
            else
            {
                // Create new admin 1
                var admin1 = new Employee
                {
                    Name = "Admin User",
                    Email = "admin@company.com",
                    Gender = "M",
                    DateOfBirth = new DateTime(1985, 1, 1),
                    JoinDate = DateTime.Now,
                    MobileNumber = "9999999999",
                    AadhaarNumber = "999999999999",
                    AccountNumber = "ADMIN123456789",
                    Department = "Administration",
                    Designation = "System Administrator",
                    PreviousCompany = "",
                    PfNumber = "PF999999999",
                    Salary = 100000.00m,
                    Address = "Admin Address",
                    PermanentAddress = "Admin Permanent Address",
                    IsActive = true,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    Password = hashedAdminPassword1,
                    Role = "ADMIN"
                };

                context.Employees.Add(admin1);
                Console.WriteLine("Created new admin user (admin@company.com)");
            }

            // Admin 2: Amit Verma
            var existingAdmin2 = await context.Employees
                .FirstOrDefaultAsync(e => e.Email == "amit.verma@example.com");

            var adminPassword2 = "amit@admin321";
            var hashedAdminPassword2 = PasswordHelper.HashPassword(adminPassword2);

            if (existingAdmin2 != null)
            {
                // Update existing admin with hashed password
                existingAdmin2.Password = hashedAdminPassword2;
                existingAdmin2.Name = "Amit Verma";
                existingAdmin2.Role = "ADMIN";
                existingAdmin2.UpdatedDate = DateTime.Now;
                Console.WriteLine("Updated existing admin user (amit.verma@example.com)");
            }
            else
            {
                // Create new admin 2
                var admin2 = new Employee
                {
                    Name = "Amit Verma",
                    Email = "amit.verma@example.com",
                    Gender = "Male",
                    DateOfBirth = new DateTime(1983, 11, 5),
                    JoinDate = new DateTime(2019, 3, 18),
                    MobileNumber = "9812345678",
                    AadhaarNumber = "112233445566",
                    AccountNumber = "AXIS000998877665",
                    Department = "Administration",
                    Designation = "IT Admin Lead",
                    PreviousCompany = "Tech Mahindra",
                    PfNumber = "PF998877665",
                    Salary = 115000.00m,
                    Address = "22 Camac Street, Kolkata",
                    PermanentAddress = "12 Ballygunge Place, Kolkata",
                    IsActive = true,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    Password = hashedAdminPassword2,
                    Role = "ADMIN"
                };

                context.Employees.Add(admin2);
                Console.WriteLine("Created new admin user (amit.verma@example.com)");
            }

            await context.SaveChangesAsync();
            
            Console.WriteLine("====== ADMIN LOGIN CREDENTIALS ======");
            Console.WriteLine($"Admin 1 - Email: admin@company.com");
            Console.WriteLine($"Admin 1 - Password: {adminPassword1}");
            Console.WriteLine($"Admin 2 - Email: amit.verma@example.com");
            Console.WriteLine($"Admin 2 - Password: {adminPassword2}");
            Console.WriteLine("=======================================");
        }

        public static async Task SeedSampleData(AppDbContext context)
        {
            // Seed some sample posts if none exist
            if (!await context.BlogPosts.AnyAsync())
            {
                var posts = new[]
                {
                    new BlogPost
                    {
                        Title = "Welcome to HR Management Portal",
                        Content = "We're excited to announce the launch of our new HR management portal with improved features and better user experience.",
                        Comment = "We're excited to announce the launch of our new HR management portal with improved features and better user experience.",
                        Author = "HR Team",
                        AddedDate = DateTime.Now.AddDays(-5)
                    },
                    new BlogPost
                    {
                        Title = "New Leave Policy Update",
                        Content = "Please review the updated leave policy. All employees are requested to go through the new guidelines.",
                        Comment = "Please review the updated leave policy. All employees are requested to go through the new guidelines.",
                        Author = "Management",
                        AddedDate = DateTime.Now.AddDays(-2)
                    }
                };

                context.BlogPosts.AddRange(posts);
                await context.SaveChangesAsync();
            }

            // Seed some sample leave requests if none exist
            if (!await context.LeaveRequests.AnyAsync())
            {
                var leaveRequests = new[]
                {
                    new LeaveRequest
                    {
                        EmpName = "John Doe",
                        Subject = "Annual Leave Request",
                        Text = "Leave Type: Annual Leave\nFrom: 2024-08-15\nTo: 2024-08-20\nDays: 5\nReason: Family vacation",
                        Status = "PENDING",
                        ParentUkid = "LR001",
                        AddedDate = DateTime.Now.AddDays(-1),
                        LeaveDays = 5
                    },
                    new LeaveRequest
                    {
                        EmpName = "Jane Smith",
                        Subject = "Sick Leave Request",
                        Text = "Leave Type: Sick Leave\nFrom: 2024-08-10\nTo: 2024-08-12\nDays: 3\nReason: Medical appointment",
                        Status = "APPROVED",
                        ParentUkid = "LR002",
                        AddedDate = DateTime.Now.AddDays(-3),
                        LeaveDays = 3
                    }
                };

                context.LeaveRequests.AddRange(leaveRequests);
                await context.SaveChangesAsync();
            }
        }
    }
}
