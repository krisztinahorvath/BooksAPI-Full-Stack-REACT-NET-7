using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab3BookAPI.Model
{
    public class UserProfile
    {
        [Key]
        [ForeignKey("User")]
        public int Id { get; set; }

        public string? Bio { get; set; }

        public string? Location { get; set; }

        public DateTime? Birthday { get; set; }

        public string? Gender { get; set; }

        public string? MaritalStatus { get; set; }

        public virtual User User { get; set; }
    }
}