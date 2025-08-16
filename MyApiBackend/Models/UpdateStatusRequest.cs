using System.ComponentModel.DataAnnotations;

namespace MyApiBackend.Models
{
    public class UpdateStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
