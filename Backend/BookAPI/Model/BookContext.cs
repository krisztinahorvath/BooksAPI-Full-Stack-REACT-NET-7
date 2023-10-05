using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
namespace Lab3BookAPI.Model
{
    public class BookContext : DbContext
    {
        public BookContext() { }
        public BookContext(DbContextOptions<BookContext> options) : base(options) {
            //Database.EnsureCreated();
        }
        public virtual DbSet<Book>? Books { get; set; }
        public virtual DbSet<Genre>? Genres { get; set; }
        public virtual DbSet<Model.Author> Authors { get; set; } = default!;

        public virtual DbSet<BookAuthor> BookAuthors { get; set; } = default!;

        public virtual DbSet<User> Users { get; set; } = default!;
        public virtual DbSet<UserProfile> UserProfiles { get; set; } = default!;

        public virtual DbSet<ChatMessage> ChatMessages { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Name)
                .IsUnique();

            modelBuilder.Entity<Book>()
                .HasOne(g => g.Genre)
                .WithMany(b => b.BookList)
                .HasForeignKey(g => g.GenreId);

            modelBuilder.Entity<Genre>()
               .HasOne(u => u.User)
               .WithMany(b => b.GenresList)
               .HasForeignKey(u => u.UserId);


            modelBuilder.Entity<BookAuthor>()
                .HasKey(t => new {t.AuthorId, t.BookId});

            modelBuilder.Entity<BookAuthor>()
             .HasOne(ba => ba.Book)
             .WithMany(b => b.BookAuthors)
             .HasForeignKey(ba => ba.BookId);

            modelBuilder.Entity<BookAuthor>()
                .HasOne(ba => ba.Author)
                .WithMany(a => a.BookAuthors)
                .HasForeignKey(ba => ba.AuthorId);
        }
    }
}
