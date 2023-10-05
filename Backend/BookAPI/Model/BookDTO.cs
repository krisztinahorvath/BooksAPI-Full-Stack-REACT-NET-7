namespace Lab3BookAPI.Model
{
    public class BookDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int Year { get; set; }
        public int Pages { get; set; }
        public float Price { get; set; }
        public string? Transcript { get; set; }

        public int GenreId { get; set; }

        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
