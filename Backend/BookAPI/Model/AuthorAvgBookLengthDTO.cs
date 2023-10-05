﻿namespace Lab3BookAPI.Model
{
    public class AuthorAvgBookLengthDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int YearOfBirth { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        public double AvgPages { get; set; }
    }
}
