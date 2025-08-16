using System.Security.Cryptography;
using System.Text;

namespace MyApiBackend.Utils
{
    public static class PasswordHelper
    {
        /// <summary>
        /// Generates a temporary password with specified length
        /// </summary>
        /// <param name="length">Length of the password (default: 12)</param>
        /// <returns>A randomly generated password</returns>
        public static string GenerateTemporaryPassword(int length = 12)
        {
            const string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowerCase = "abcdefghijklmnopqrstuvwxyz";
            const string numbers = "0123456789";
            const string specialChars = "!@#$%&*";
            
            var allChars = upperCase + lowerCase + numbers + specialChars;
            var password = new StringBuilder();
            
            using (var rng = RandomNumberGenerator.Create())
            {
                // Ensure at least one character from each category
                password.Append(GetRandomChar(upperCase, rng));
                password.Append(GetRandomChar(lowerCase, rng));
                password.Append(GetRandomChar(numbers, rng));
                password.Append(GetRandomChar(specialChars, rng));
                
                // Fill the remaining length with random characters
                for (int i = 4; i < length; i++)
                {
                    password.Append(GetRandomChar(allChars, rng));
                }
            }
            
            // Shuffle the password to avoid predictable patterns
            return ShuffleString(password.ToString());
        }
        
        /// <summary>
        /// Hashes a password using BCrypt (you can implement your preferred hashing method)
        /// For now, this is a simple implementation. Consider using BCrypt.Net-Next package
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <returns>Hashed password</returns>
        public static string HashPassword(string password)
        {
            // Simple SHA256 hashing (replace with BCrypt for production)
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "YourSaltHere"));
                return Convert.ToBase64String(hashedBytes);
            }
        }
        
        /// <summary>
        /// Verifies a password against its hash
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <param name="hashedPassword">Hashed password</param>
        /// <returns>True if password matches</returns>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var passwordHash = HashPassword(password);
            return passwordHash == hashedPassword;
        }
        
        private static char GetRandomChar(string chars, RandomNumberGenerator rng)
        {
            byte[] randomBytes = new byte[4];
            rng.GetBytes(randomBytes);
            uint randomInt = BitConverter.ToUInt32(randomBytes, 0);
            return chars[(int)(randomInt % (uint)chars.Length)];
        }
        
        private static string ShuffleString(string input)
        {
            var array = input.ToCharArray();
            var rng = new Random();
            
            for (int i = array.Length - 1; i > 0; i--)
            {
                int j = rng.Next(i + 1);
                (array[i], array[j]) = (array[j], array[i]);
            }
            
            return new string(array);
        }
    }
}
