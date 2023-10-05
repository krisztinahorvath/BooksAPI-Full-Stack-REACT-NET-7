using Lab3BookAPI.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab3BookAPI.Validations;
using Microsoft.AspNetCore.Cors;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;

namespace Lab3BookAPI.Controllers
{
    [Route("api/authors")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly Validate _validate;

        public AuthorController(BookContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
        }

        // GET: api/Authors
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AuthorDTO>>> GetAuthor(int pageNumber = 0, int pageSize = 10)
        {
            if (_context.Authors == null)
                return NotFound();

            var authors = await _context.Authors
                .Include(a => a.User)
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .Select(x => AuthorToDTO(x))
                .ToListAsync();

            return authors;
        }

        [HttpGet("autocomplete")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Author>>> AutocompleteName(string query, int pageNumber=1, int pageSize=100)
        {
            var names = await _context.Authors.Where(t => t.Name.ToLower().Contains(query.ToLower()))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(names);
        }

        [HttpGet("count-books")]
        [AllowAnonymous]
        public async Task<IEnumerable<int>> GetBookCountsForAuthors(int pageNumber = 0, int pageSize = 10)
        {
            var authorCounts = await _context.BookAuthors
                .GroupBy(ba => ba.AuthorId)
                .Select(g => new { AuthorId = g.Key, AuthorCount = g.Count() })
                .OrderBy(ac => ac.AuthorId)
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .Select(ac => ac.AuthorCount)
                .ToListAsync();

            return authorCounts;
        }

        [HttpGet("total-number-pages")]
        [AllowAnonymous]
        public async Task<int> GetTotalNrPages(int pageSize = 10)
        {
            int totalAuthors = await _context.Authors.CountAsync();
            int totalPages = totalAuthors / pageSize;
            if (totalAuthors % pageSize > 0)
            {
                totalPages++;
            }
            return totalPages;
        }

        // GET: api/Authors/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthorWithBookDTO>> GetAuthor(int id)
        {
            if (_context.Authors == null)
            {
                return NotFound();
            }
            var author = await _context.Authors.FirstOrDefaultAsync(x => x.Id == id);

            if (author == null)
            {
                return NotFound();
            }

            var book = await _context.BookAuthors.Where(b => b.AuthorId == id).Select(b => b.Book).ToListAsync();

            var authorDTO = new AuthorWithBookDTO
            {
                Id = id,
                Name = author.Name,
                YearOfBirth = author.YearOfBirth,
                Address = author.Address,
                Email = author.Email,
                PhoneNumber = author.PhoneNumber,
                Books = book

            };

            if (authorDTO == null)
            {
                return NotFound();
            }

            return authorDTO;
        }

        [HttpGet("get/orderedBooks")]
        [AllowAnonymous]
        public async Task<List<AuthorAvgBookLengthDTO>> GetAuthorWithAverageBookLength()
        {
            var b = await (from bookAuthors in _context.BookAuthors
                           join books in _context.Books on bookAuthors.BookId equals books.Id
                           join authors in _context.Authors on bookAuthors.AuthorId equals authors.Id
                           group books by authors into g
                           select new AuthorAvgBookLengthDTO
                           {
                               Id = g.Key.Id,
                               Name = g.Key.Name,
                               YearOfBirth = g.Key.YearOfBirth,
                               Address = g.Key.Address,
                               Email = g.Key.Email,
                               PhoneNumber = g.Key.PhoneNumber,
                               AvgPages = g.Average(book => book.Pages)
                           }
                     )
                     .Take(100)
                     .OrderBy(dto => dto.AvgPages).ToListAsync();

            return b;
        }
        private static int _pageSize = 10;

        [HttpPost("pageSizeChange")]
        [AllowAnonymous]
        public IActionResult PostPageSize(int pageSize)
        {
            _pageSize = pageSize;

            return Ok();
        }


        // PUT: api/Authors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(int id, AuthorDTO authorDTO)
        {
            if (id != authorDTO.Id)
            {
                return BadRequest();
            }

            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            if (!_validate.IsStringNonEmpty(authorDTO.Name))
            {
                return BadRequest("Entity set 'BookContext.Author.Name'  is null.");
            }

            if (!_validate.IsValidEmail(authorDTO.Email))
            {
                return BadRequest("The field 'Email' should be of the form: 'text@text.com/.ro/etc.'");
            }

            if (!_validate.IsDateValid(authorDTO.YearOfBirth))
            {
                return BadRequest("The field 'YearOfBirth' should be a positive integer between 1500 and 2023!");
            }

            author.Name = authorDTO.Name;
            author.YearOfBirth = authorDTO.YearOfBirth;
            author.Address = authorDTO.Address;
            author.Email = authorDTO.Email;
            author.PhoneNumber = authorDTO.PhoneNumber;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthorExists(id))
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

        // POST: api/Authors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AuthorDTO>> PostAuthor(AuthorDTO authorDTO)
        {
            if (_context.Authors == null)
            {
                return Problem("Entity set 'BookContext.Author'  is null.");
            }

            if (!_validate.IsStringNonEmpty(authorDTO.Name))
            {
                return BadRequest("Entity set 'BookContext.Author.Name'  is null.");
            }

            if (!_validate.IsEmailUnique(_context, authorDTO.Email))
            {
                return BadRequest("The given 'Email' already exists in the database!");
            }

            if (!_validate.IsValidEmail(authorDTO.Email))
            {
                return BadRequest("The field 'Email' should be of the form: 'text@text.com'");
            }

            if (!_validate.IsDateValid(authorDTO.YearOfBirth))
            {
                return BadRequest("The field 'YearOfBirth' should be a positive integer between 1500 and 2023!");
            }

            // Extract user id from JWT token
            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int userId))
            {
                return Unauthorized("Invalid token!");
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found!");
            }

            var author = new Author
            {
                Name = authorDTO.Name,
                YearOfBirth = authorDTO.YearOfBirth,
                Address = authorDTO.Address,
                Email = authorDTO.Email,
                PhoneNumber = authorDTO.PhoneNumber,
                User = user,
                UserId = userId
            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, AuthorToDTO(author));
        }

        // DELETE: api/Authors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            // Extract user id from JWT token
            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int userId))
            {
                return Unauthorized("Invalid token!");
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found!");
            }

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            if(author.UserId != userId)
            {
                return Unauthorized("Invalid token!");
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorExists(int id)
        {
            return (_context.Authors?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static AuthorDTO AuthorToDTO(Author author)
        {
            return new AuthorDTO
            {
                Id = author.Id,
                Name = author.Name,
                YearOfBirth = author.YearOfBirth,
                Address = author.Address,
                Email = author.Email,
                PhoneNumber = author.PhoneNumber,
                UserId = author.User.Id,
                UserName = author.User.Name,
            };
        }
    }
}