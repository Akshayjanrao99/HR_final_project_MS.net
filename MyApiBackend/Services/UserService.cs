using MyApiBackend.Data;
using MyApiBackend.Models;
using MyApiBackend.Utils;

namespace MyApiBackend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public User? Authenticate(LoginRequest request)
        {
            // Find employee by email first
            var employee = _context.Employees.FirstOrDefault(x => x.Email == request.Username);
            
            if (employee != null)
            {
                // Verify the password using our password helper
                bool isPasswordValid = PasswordHelper.VerifyPassword(request.Password, employee.Password);
                
                if (isPasswordValid)
                {
                    // Convert Employee to User for consistent response
                    return new User
                    {
                        Id = employee.Id,
                        Username = employee.Email,
                        Email = employee.Email,
                        FirstName = employee.Name.Split(' ')[0],
                        LastName = employee.Name.Contains(' ') ? employee.Name.Substring(employee.Name.IndexOf(' ') + 1) : "",
                        Role = employee.Role,
                        CreatedAt = employee.CreatedDate != default(DateTime) ? employee.CreatedDate : DateTime.UtcNow,
                        UpdatedAt = employee.UpdatedDate != default(DateTime) ? employee.UpdatedDate : DateTime.UtcNow
                    };
                }
            }

            return null;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.Select(user => new User
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
                // Password is intentionally excluded
            }).ToList();
        }

        public User? GetById(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return null;

            // Remove password from return value
            user.Password = string.Empty;
            return user;
        }

        public User Create(User user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            
            _context.Users.Add(user);
            _context.SaveChanges();

            // Remove password from return value
            user.Password = string.Empty;
            return user;
        }

        public User Update(User user)
        {
            var existingUser = _context.Users.Find(user.Id);
            if (existingUser == null)
                throw new ArgumentException("User not found");

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.UpdatedAt = DateTime.UtcNow;

            // Only update password if provided
            if (!string.IsNullOrEmpty(user.Password))
            {
                existingUser.Password = user.Password;
            }

            _context.SaveChanges();

            // Remove password from return value
            existingUser.Password = string.Empty;
            return existingUser;
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}
