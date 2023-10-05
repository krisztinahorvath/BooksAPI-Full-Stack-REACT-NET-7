﻿namespace Lab3BookAPI.Model
{
    public class Author
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int YearOfBirth { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        public virtual ICollection<BookAuthor> BookAuthors { get; set;  }

        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
