using Lab3BookAPI.Model;
using Lab3BookAPI.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Lab3BookAPI.Controllers
{
    [Route("api/genres")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly Validate _validate;

        public GenreController(BookContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
        }

        // GET: api/genre
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<GenreDTO>>> GetGenres(int pageNumber = 0, int pageSize = 10)
        {
            if (_context.Genres == null)
            {
                return NotFound();
            }

            return await _context.Genres
                .Include(a => a.User)
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .Select(x => GenreToDTO(x))
                .ToListAsync();
        }

        [HttpGet("total-number-pages")]
        [AllowAnonymous]
        public async Task<int> GetTotalNrPages(int pageSize = 10)
        {
            int totalGenres = await _context.Genres.CountAsync();
            int totalPages = totalGenres / pageSize;
            if (totalGenres % pageSize > 0)
            {
                totalPages++;
            }
            return totalPages;
        }


        // GET: api/genre/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Genre>> GetGenre(int id)
        {
            if (_context.Genres == null)
            {
                return NotFound();
            }

            var genre = await _context.Genres.Include(b => b.BookList).FirstOrDefaultAsync(b => b.Id == id);

            if (genre == null)
            {
                return NotFound();
            }

            return genre;
        }

        // PUT: api/genre/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGenre(int id, GenreDTO genreDTO)
        {
            if (id != genreDTO.Id)
            {
                return BadRequest();
            }

            var genre = await _context.Genres.FindAsync(id);

            if (genre == null)
            {
                return NotFound();
            }

            genre.Name = genreDTO.Name;
            genre.Description = genreDTO.Description;
            genre.Subgenre = genreDTO.Subgenre;
            genre.CountryOfOrigin = genreDTO.CountryOfOrigin;
            genre.GenreRating = genreDTO.GenreRating;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GenreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpGet("count-books")]
        [AllowAnonymous]
        public async Task<IEnumerable<int>> GetBookCountsForGenres(int pageNumber = 0, int pageSize = 10)
        {
            var bookCounts = await (from g in _context.Genres
                                    join b in _context.Books on g.Id equals b.GenreId into gb
                                    from book in gb.DefaultIfEmpty()
                                    group book by g.Id into genreGroup
                                    orderby genreGroup.Key
                                    select genreGroup.Count(b => b != null))
                                    .Skip(pageNumber * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            return bookCounts;
        }

        [HttpPost("{id}/bookList")]
        public async Task<ActionResult<Genre>> PostGenreWithListOfBooks(int id, List<BookDTO> books)
        {
            if (_context.Genres == null)
            {
                return Problem("Entity set 'BookContext.Genres'  is null.");
            }

            var genre = await _context.Genres.FindAsync(id);

            if (genre == null)
            {
                return BadRequest();
            }

            foreach (var b in books)
            {


                var newBook = new Book
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    Year = b.Year,
                    Pages = b.Pages,
                    Price = b.Price,
                    Transcript = b.Transcript,
                    GenreId = id
                };

                
                _context.Books.Add(newBook);
                
           
                await _context.SaveChangesAsync();
            
            }

            return NoContent();
        }

        // POST: api/genre
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Genre>> PostGenre(GenreDTO genreDTO)
        {
            if (_context.Genres == null)
            {
                return Problem("Entity set 'BookContext.Genre'  is null.");
            }

            if (!_validate.IsStringNonEmpty(genreDTO.Name))
            {
                return BadRequest("The 'Name' field should be non-empty!");
            }

            if (!_validate.IsRatingValid(genreDTO.GenreRating))
            {
                return BadRequest("The 'Genre Rating' field should be a positive integer between 1 and 10!");
            }


            var genre = new Genre
            {
                Id = genreDTO.Id,
                Name = genreDTO.Name,
                Description = genreDTO.Description,
                Subgenre = genreDTO.Subgenre,
                CountryOfOrigin = genreDTO.CountryOfOrigin,
                GenreRating = genreDTO.GenreRating,
                BookList = null!
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGenre), new { id = genreDTO.Id }, GenreToDTO(genre));
        }

        // DELETE: api/genre/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            if (_context.Genres == null)
            {
                return NotFound();
            }
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
            {
                return NotFound();
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GenreExists(int id)
        {
            return (_context.Genres?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static GenreDTO GenreToDTO(Genre genre)
        {
            return new GenreDTO
            {
                Id = genre.Id,
                Name = genre.Name,
                Description = genre.Description,
                Subgenre = genre.Subgenre,
                CountryOfOrigin = genre.CountryOfOrigin,
                GenreRating = genre.GenreRating,
                UserId = genre.User.Id,
                UserName = genre.User.Name,
            };
        }
    }
}
