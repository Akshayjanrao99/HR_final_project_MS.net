using System.ComponentModel.DataAnnotations;

namespace MyApiBackend.Models
{
    public class CreatePostRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? Author { get; set; }

        public string? Comment { get; set; }
    }
}
