using MyApiBackend.Data;
using MyApiBackend.Models;
using System.Threading.Tasks;

namespace MyApiBackend.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IRepository<Employee> _employees;
        private IRepository<LeaveRequest> _leaveRequests;
        private IRepository<BlogPost> _blogPosts;
        private IRepository<Payroll> _payrolls;
        private IRepository<LeaveTracker> _leaveTrackers;
        private IRepository<Message> _messages;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public IRepository<Employee> Employees =>
            _employees ??= new Repository<Employee>(_context);

        public IRepository<LeaveRequest> LeaveRequests =>
            _leaveRequests ??= new Repository<LeaveRequest>(_context);

        public IRepository<BlogPost> BlogPosts =>
            _blogPosts ??= new Repository<BlogPost>(_context);

        public IRepository<Payroll> Payrolls =>
            _payrolls ??= new Repository<Payroll>(_context);

        public IRepository<LeaveTracker> LeaveTrackers =>
            _leaveTrackers ??= new Repository<LeaveTracker>(_context);

        public IRepository<Message> Messages =>
            _messages ??= new Repository<Message>(_context);

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
