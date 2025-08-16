using System;
using System.ComponentModel.DataAnnotations;

namespace MyApiBackend.Models
{
    public enum MessageType
    {
        Text,
        Image,
        File,
        System
    }

    public class Message
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SenderId { get; set; }

        [Required]
        public string SenderName { get; set; }

        [Required]
        public string ReceiverId { get; set; }

        [Required]
        public string ReceiverName { get; set; }

        [Required]
        public string Content { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Timestamp { get; set; }

        public MessageType MessageType { get; set; }
    }
}
