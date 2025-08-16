using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MyApiBackend.Models;

namespace MyApiBackend.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlContent, string? textContent = null)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder();
                
                if (!string.IsNullOrEmpty(htmlContent))
                {
                    bodyBuilder.HtmlBody = htmlContent;
                }
                
                if (!string.IsNullOrEmpty(textContent))
                {
                    bodyBuilder.TextBody = textContent;
                }
                else if (!string.IsNullOrEmpty(htmlContent))
                {
                    // Create a simple text version from HTML if no text content provided
                    bodyBuilder.TextBody = System.Text.RegularExpressions.Regex.Replace(htmlContent, "<.*?>", string.Empty);
                }

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, 
                    _emailSettings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);
                
                await client.AuthenticateAsync(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Email sent successfully to {toEmail}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
                return false;
            }
        }

        public async Task<bool> SendWelcomeEmailAsync(Employee employee, string tempPassword)
        {
            var subject = "🎉 Welcome to Our Company - Your Journey Begins Here!";
            
            // Professional text content
            var textContent = string.Format(
                "Dear {0},\n\n" +
                "Welcome to our company! We are excited to have you join our team.\n\n" +
                "Your account has been successfully created with the following details:\n" +
                "Email: {1}\n" +
                "Temporary Password: {2}\n" +
                "Department: {3}\n" +
                "Designation: {4}\n" +
                "Start Date: {5}\n\n" +
                "IMPORTANT: Please login to your account and change your password immediately for security purposes.\n\n" +
                "Login Portal: [Your Company Portal URL]\n\n" +
                "If you have any questions, please don't hesitate to contact the HR department.\n\n" +
                "We look forward to working with you and wish you great success in your new role!\n\n" +
                "Best regards,\n" +
                "HR Team\n" +
                "Employee Management System",
                employee.Name, employee.Email, tempPassword, employee.Department, employee.Designation, employee.JoinDate.ToString("MMM dd, yyyy")
            );

            // Simple but professional HTML email template
            var htmlContent = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
                        .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ padding: 30px; }}
                        .credentials {{ background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }}
                        .credential-row {{ margin: 10px 0; }}
                        .label {{ font-weight: bold; color: #495057; }}
                        .value {{ font-family: monospace; background: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #ddd; }}
                        .password {{ background: #fff3cd; border-color: #ffeaa7; color: #856404; font-weight: bold; }}
                        .warning {{ background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                        .footer {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>🎉 Welcome to Our Team!</h1>
                            <p>Your journey with us begins today</p>
                        </div>
                        <div class='content'>
                            <h2>Dear {employee.Name},</h2>
                            <p>We are absolutely thrilled to welcome you to our company! Your skills and experience make you a valuable addition to our team.</p>
                            
                            <div class='credentials'>
                                <h3>Your Account Details</h3>
                                <div class='credential-row'><span class='label'>Email:</span> <span class='value'>{employee.Email}</span></div>
                                <div class='credential-row'><span class='label'>Temporary Password:</span> <span class='value password'>{tempPassword}</span></div>
                                <div class='credential-row'><span class='label'>Department:</span> <span class='value'>{employee.Department}</span></div>
                                <div class='credential-row'><span class='label'>Designation:</span> <span class='value'>{employee.Designation}</span></div>
                                <div class='credential-row'><span class='label'>Start Date:</span> <span class='value'>{employee.JoinDate:MMM dd, yyyy}</span></div>
                            </div>
                            
                            <div class='warning'>
                                <h3>🔒 Important Security Notice</h3>
                                <p><strong>Please change your password immediately</strong> after your first login for security purposes.</p>
                            </div>
                            
                            <h3>📋 Next Steps:</h3>
                            <ul>
                                <li>Log in to the employee portal using your credentials</li>
                                <li>Update your password and complete your profile</li>
                                <li>Review company policies and handbook</li>
                                <li>Connect with your team members</li>
                            </ul>
                            
                            <p>If you have any questions, please don't hesitate to contact the HR department.</p>
                            <p>Welcome aboard! We look forward to working with you.</p>
                        </div>
                        <div class='footer'>
                            <p><strong>Employee Management System</strong><br>HR Department</p>
                            <p>Need help? Contact us at hr@company.com</p>
                        </div>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(employee.Email, subject, htmlContent, textContent);
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            var subject = "Password Reset Request";
            
            var htmlContent = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Password Reset</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
                        .header {{ background-color: #dc3545; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }}
                        .content {{ padding: 20px; }}
                        .token {{ background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545; }}
                        .footer {{ background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class='content'>
                            <p>You have requested to reset your password.</p>
                            <div class='token'>
                                <p><strong>Reset Token:</strong> <code>{resetToken}</code></p>
                            </div>
                            <p>If you did not request this reset, please ignore this email.</p>
                        </div>
                        <div class='footer'>
                            <p>Best regards,<br>Employee Management System</p>
                        </div>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(toEmail, subject, htmlContent);
        }
    }
}
