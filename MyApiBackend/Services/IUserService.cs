using MyApiBackend.Models;

namespace MyApiBackend.Services
{
    public interface IUserService
    {
        User? Authenticate(LoginRequest request);
        IEnumerable<User> GetAll();
        User? GetById(int id);
        User Create(User user);
        User Update(User user);
        void Delete(int id);
    }
}
