using Microsoft.EntityFrameworkCore;

namespace MyApiBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MyApiBackend.Models.User> Users { get; set; }
        public DbSet<MyApiBackend.Models.Employee> Employees { get; set; }
        public DbSet<MyApiBackend.Models.LeaveRequest> LeaveRequests { get; set; }
        public DbSet<MyApiBackend.Models.BlogPost> BlogPosts { get; set; }
        public DbSet<MyApiBackend.Models.Payroll> Payrolls { get; set; }
        public DbSet<MyApiBackend.Models.LeaveTracker> LeaveTrackers { get; set; }
        public DbSet<MyApiBackend.Models.Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision for Employee
            modelBuilder.Entity<MyApiBackend.Models.Employee>()
                .Property(e => e.Salary)
                .HasPrecision(18, 2);

            // Configure decimal precision for Payroll
            modelBuilder.Entity<MyApiBackend.Models.Payroll>(entity =>
            {
                entity.Property(p => p.BasicSalary).HasPrecision(18, 2);
                entity.Property(p => p.ConveyanceAllowance).HasPrecision(18, 2);
                entity.Property(p => p.GrossSalary).HasPrecision(18, 2);
                entity.Property(p => p.HouseRentAllowance).HasPrecision(18, 2);
                entity.Property(p => p.IncomeTax).HasPrecision(18, 2);
                entity.Property(p => p.MedicalAllowance).HasPrecision(18, 2);
                entity.Property(p => p.NetSalary).HasPrecision(18, 2);
                entity.Property(p => p.OtherAllowances).HasPrecision(18, 2);
                entity.Property(p => p.OtherDeductions).HasPrecision(18, 2);
                entity.Property(p => p.ProfessionalTax).HasPrecision(18, 2);
                entity.Property(p => p.ProvidentFund).HasPrecision(18, 2);
            });

            // Configure composite keys, relationships etc.

        }
    }
}
