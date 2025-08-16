using MyApiBackend.Models;
using System;
using System.Threading.Tasks;

namespace MyApiBackend.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Employee> Employees { get; }
        IRepository<LeaveRequest> LeaveRequests { get; }
        IRepository<BlogPost> BlogPosts { get; }
        IRepository<Payroll> Payrolls { get; }
        IRepository<LeaveTracker> LeaveTrackers { get; }
        IRepository<Message> Messages { get; }

        Task<int> CompleteAsync();
    }
}
