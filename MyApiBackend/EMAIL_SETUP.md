# Email Authentication Setup for Employee Management System

This document explains how to use the email authentication system in your .NET Core API.

## Features Implemented

✅ **Automatic Welcome Emails**: When an admin creates a new employee, a welcome email is automatically sent to the employee's email address  
✅ **Secure Password Generation**: Each new employee gets a randomly generated secure temporary password  
✅ **Password Hashing**: Passwords are securely hashed using SHA256 before storing in the database  
✅ **Beautiful Professional Email Templates**: Modern, responsive HTML email templates with gradient backgrounds and professional styling  
✅ **Working Authentication**: Employees can login using the temporary password sent via email  
✅ **Password Change Functionality**: Secure password change endpoint for employees  
✅ **Email Testing Endpoints**: Test your email configuration before going live  
✅ **Admin User Setup**: Automatic admin user creation with secure hashed password

## Configuration

### 1. Email Settings (appsettings.json)
The email settings are configured in your `appsettings.json`:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "s.shubham14march@gmail.com",
    "SmtpPassword": "zangzifmwlygtkdl",
    "FromEmail": "s.shubham14march@gmail.com",
    "FromName": "Employee Management System",
    "EnableSsl": true
  }
}
```

### 2. Gmail App Password Setup
For Gmail, you need to use an App Password instead of your regular password:

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this app password in the `SmtpPassword` field

## API Endpoints

### 1. Create Employee (with automatic email)
**POST** `/api/employees`

When you create a new employee, the system will:
- Generate a secure temporary password
- Hash and store the password
- Send a welcome email with login credentials
- Return employee data without exposing the password

Example request:
```json
{
  "employeeName": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "designation": "Software Developer",
  "salary": 75000,
  "dateOfBirth": "1990-01-15",
  "joinDate": "2024-08-06",
  "contactNumber": "+1234567890",
  "gender": "M"
}
```

### 2. Test Email Configuration
**POST** `/api/emailtest/test-email`

Test basic email functionality:
```json
{
  "toEmail": "your-test@email.com"
}
```

### 3. Test Welcome Email
**POST** `/api/emailtest/test-welcome-email`

Test the welcome email template:
```json
{
  "toEmail": "your-test@email.com",
  "name": "Test User"
}
```

## Email Templates

### Welcome Email Features:
- Professional HTML design with company branding
- Employee details (name, department, designation, join date)
- Temporary login credentials
- Security reminders
- Both HTML and plain text versions

### Security Features:
- Passwords are never stored in plain text
- Temporary passwords are randomly generated with:
  - Uppercase letters
  - Lowercase letters  
  - Numbers
  - Special characters
- Email sending failures don't prevent employee creation
- Detailed logging for troubleshooting

## Testing the Setup

1. **Start your application**:
   ```bash
   dotnet run
   ```

2. **Test basic email**:
   ```bash
   curl -X POST "https://localhost:5001/api/emailtest/test-email" \
        -H "Content-Type: application/json" \
        -d '{"toEmail": "your-email@example.com"}'
   ```

3. **Test welcome email**:
   ```bash
   curl -X POST "https://localhost:5001/api/emailtest/test-welcome-email" \
        -H "Content-Type: application/json" \
        -d '{"toEmail": "your-email@example.com", "name": "Test User"}'
   ```

4. **Create a test employee**:
   ```bash
   curl -X POST "https://localhost:5001/api/employees" \
        -H "Content-Type: application/json" \
        -d '{"employeeName": "Jane Smith", "email": "jane.smith@example.com", "department": "HR", "designation": "HR Manager", "salary": 65000}'
   ```

## Authentication System

### Admin Login
The system automatically creates an admin user on first run:
- **Email**: `admin@company.com`
- **Password**: `admin123`

### Employee Login
Employees can login using:
- **Username**: Their email address
- **Password**: The temporary password sent via email

### API Endpoints:

1. **Login**:
   ```
   POST /api/auth/login
   {
     "username": "email@example.com",
     "password": "temporary-password"
   }
   ```

2. **Change Password**:
   ```
   POST /api/auth/change-password
   {
     "email": "email@example.com",
     "currentPassword": "old-password",
     "newPassword": "new-secure-password"
   }
   ```

### Password Security:
- All passwords are hashed using SHA256 with salt
- Temporary passwords are randomly generated with 12 characters
- Employees should change their password after first login

## Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check Gmail app password is correct
   - Verify SMTP settings
   - Check application logs for detailed error messages

2. **Authentication failed**:
   - Ensure 2FA is enabled on Gmail
   - Use app password, not regular password
   - Check username format (full email address)

3. **Build errors**:
   ```bash
   dotnet restore
   dotnet build
   ```

### Logs:
Check the application logs for detailed email sending status:
- ✅ Success: "Email sent successfully to user@example.com"
- ❌ Error: "Failed to send email to user@example.com"

## Security Recommendations

1. **Production Environment**:
   - Move email credentials to Azure Key Vault or similar
   - Use environment variables instead of appsettings.json
   - Implement rate limiting for email sending

2. **Password Security**:
   - Consider using BCrypt instead of SHA256 for password hashing
   - Add password expiration policies
   - Implement password complexity requirements

3. **Email Security**:
   - Add email validation and sanitization
   - Implement email sending queues for high volume
   - Add retry mechanisms for failed emails

## Files Created/Modified

### New Files:
- `Models/EmailSettings.cs` - Email configuration model
- `Services/IEmailService.cs` - Email service interface  
- `Services/EmailService.cs` - Email service implementation
- `Utils/PasswordHelper.cs` - Password generation and hashing utilities
- `Controllers/EmailTestController.cs` - Email testing endpoints

### Modified Files:
- `MyApiBackend.csproj` - Added MailKit and MimeKit packages
- `appsettings.json` - Added email configuration
- `Program.cs` - Registered email services
- `Controllers/EmployeeController.cs` - Added email sending to employee creation

The system is now ready to automatically send professional welcome emails whenever new employees are added to your system!
