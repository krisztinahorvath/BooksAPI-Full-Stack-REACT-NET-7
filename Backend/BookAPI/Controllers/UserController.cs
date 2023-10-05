using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Lab3BookAPI.Model;
using Lab3BookAPI.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;

namespace Lab3BookAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly Validate _validate;
        private readonly IConfiguration _config;

        public UsersController(BookContext context, JwtSettings jwtSettings, Validate validate, IConfiguration config)
        {
            _context = context;
            _jwtSettings = jwtSettings;
            _validate = validate;
            _config = config;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUser(int pageNumber = 0, int pageSize = 10)
        {
            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .Select(x => UserToDTO(x))
                .ToListAsync();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Register(UserDTO model)
        {
            // Check if username is already taken
            if (await _context.Users.AnyAsync(u => u.Name == model.Name))
            {
                return Conflict("Username is already taken.");
            }

            // Validate password
            if (!_validate.IsPasswordValid(model.Password))
            {
                return BadRequest("Password is not strong enough.");
            }

            // Generate confirmation code
            string confirmationCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
            DateTime confirmationCodeExpiration = DateTime.UtcNow.AddMinutes(10);

            // Create user and user profile
            User user = new User
            {
                Name = model.Name,
                Password = HashPassword(model.Password),
                IsConfirmed = false,
                ConfirmationCode = confirmationCode,
                ConfirmationCodeExpiration = confirmationCodeExpiration,
                UserProfile = new UserProfile
                {
                    Id = model.Id,
                }
            };

            // Add user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = HashPassword(user.Password)
            };

            return Ok(new { confirmationCode });
        }

        // GET /api/register/confirm/{confirmationCode}
        [HttpGet("register/confirm/{confirmationCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> Confirm(string confirmationCode)
        {
            // Find user with confirmation code
            User user = await _context.Users.FirstOrDefaultAsync(u => u.ConfirmationCode == confirmationCode);
            if (user == null)
            {
                return NotFound("Confirmation code is invalid.");
            }

            // Check if confirmation code is expired
            if (DateTime.UtcNow > user.ConfirmationCodeExpiration)
            {
                return BadRequest("Confirmation code has expired.");
            }

            // Confirm user account
            user.IsConfirmed = true;
            user.ConfirmationCode = null;
            user.ConfirmationCodeExpiration = null;
            await _context.SaveChangesAsync();

            return Ok("Account confirmed.");
        }


        [HttpGet("user-profile/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileStatisticsDTO>> GetUserProfileWithStatistics(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userProfileDTO = new UserProfileStatisticsDTO
            {
                Id = id,
                Name = user.Name,
                Bio = user.UserProfile.Bio,
                Location = user.UserProfile.Location,
                Birthday = user.UserProfile.Birthday,
                Gender = user.UserProfile.Gender,
                MaritalStatus = user.UserProfile.MaritalStatus,
                NrOfBooks = await _context.Books.CountAsync(b => b.UserId == id),
                NrOfAuthors = await _context.Authors.CountAsync(a => a.UserId == id),
                NrOfGenres = await _context.Genres.CountAsync(g => g.UserId == id)
            };

            return Ok(userProfileDTO);
        }

        [HttpPost("bulk-delete")]
        [Authorize(Policy = "AdminUser")]
        public async Task<IActionResult> BulkDelete()
        {
            // Delete all entities from the database
            _context.Authors.RemoveRange(_context.Authors);
            _context.Genres.RemoveRange(_context.Genres);
            _context.Books.RemoveRange(_context.Books);
            _context.BookAuthors.RemoveRange(_context.BookAuthors);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("generate-data")]
        [Authorize(Policy = "AdminUser")]
        public async Task<IActionResult> GenerateData()
        {
            var connectionString = _config.GetConnectionString("LocalBooksDatabase");

            // Read the SQL script from the file
            var script = System.IO.File.ReadAllText("C:\\Facultate\\Semestrul 4\\MPP\\Labs\\inserts\\InsertData.sql");

            // Execute the SQL script
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var command = new SqlCommand(script, connection);
                await command.ExecuteNonQueryAsync();
            }

            return Ok();
        }


        // POST /api/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserDTO model)
        {
            // Find user by username and password
            User user = await _context.Users
                .FirstOrDefaultAsync(u => u.Name == model.Name && u.Password == HashPassword(model.Password));

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Check if user account is confirmed
            if ((bool)!user.IsConfirmed)
            {
                return Unauthorized("Account is not confirmed.");
            }

            // Generate JWT token
            string token = GenerateJwtToken(user, _jwtSettings);

            return Ok(new { token });
        }

        // Helper method to generate a confirmation code
        private string GenerateConfirmationCode()
        {
            string confirmationCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
            DateTime confirmationCodeExpiration = DateTime.UtcNow.AddMinutes(10);
            return confirmationCode;
        }

        // Helper method to generate a JWT token
        private string GenerateJwtToken(User user, JwtSettings jwtSettings)
        {
            var claims = new[]
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                 new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings.Issuer,
                audience: jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string HashPassword(string password)
        {
            // Convert password to bytes
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            // Create SHA-256 hash object
            using (SHA256 sha256 = SHA256.Create())
            {
                // Compute hash value of password bytes
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);

                // Convert hash bytes to hexadecimal string
                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }

        private static UserDTO UserToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = user.Password,
            };
        }
    }
}

