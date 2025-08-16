using System;
using System.ComponentModel.DataAnnotations;

namespace MyApiBackend.Models
{
    public class BlogPost
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Comment { get; set; }

        [DataType(DataType.Date)]
        public DateTime AddedDate { get; set; }

        public string Content { get; set; }

        public string Author { get; set; }
    }
}
