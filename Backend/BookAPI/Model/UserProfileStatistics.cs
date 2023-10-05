using Microsoft.CodeAnalysis.Elfie.Model.Tree;

namespace Lab3BookAPI.Model
{
    public class UserProfileStatisticsDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Bio { get; set; }

        public string? Location { get; set; }

        public DateTime? Birthday { get; set; }

        public string? Gender { get; set; }

        public string? MaritalStatus { get; set; }

        public int NrOfBooks { get; set; }

        public int NrOfAuthors { get; set; }

        public int NrOfGenres { get; set; }
    }
}
