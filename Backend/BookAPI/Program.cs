using Lab3BookAPI.Model;
using Lab3BookAPI.Validations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;
using System.Text;
using Lab3BookAPI.Controllers;
using Lab3BookAPI.Controllers.ChatApp;

namespace BooksAPI
{
    public class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //builder.Services.AddControllers().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            builder.Services.AddControllers(
                options =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));
                }
                )
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
                .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
            ;

            var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
            builder.Services.Configure<JwtSettings>(jwtSettingsSection);
            var jwtSettings = jwtSettingsSection.Get<JwtSettings>();


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
           .AddJwtBearer(options =>
           {
               var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuerSigningKey = true,
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
                   ValidateIssuer = false,
                   ValidateAudience = false,
                   ValidateLifetime = true,
                   ClockSkew = TimeSpan.Zero
               };
           });

            builder.Services.AddSingleton<Validate>();
            builder.Services.AddSingleton(jwtSettings);

            // add authorization policies based on user roles
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AnonymousUser", policy => policy.RequireRole(Role.Unconfirmed.ToString(), Role.Regular.ToString(), Role.Moderator.ToString(), Role.Admin.ToString()));
                options.AddPolicy("AllLoggedUsers", policy => policy.RequireRole(Role.Regular.ToString(), Role.Moderator.ToString(), Role.Admin.ToString()));
                options.AddPolicy("RegularUser", policy => policy.RequireRole(Role.Regular.ToString()));
                options.AddPolicy("ModeratorUser", policy => policy.RequireRole(Role.Moderator.ToString()));
                options.AddPolicy("AdminUser", policy => policy.RequireRole(Role.Admin.ToString()));
            });

            // add the database context to the DI container
            // and specify that the database context will use a sql server database

            var localConnectionString = "LocalBooksDatabase";
            if (localConnectionString.IsNullOrEmpty())
            {
                builder.Services.AddDbContext<BookContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("BooksDatabase")));
            }
            else
                builder.Services.AddDbContext<BookContext>(options =>
                {
                    options.UseSqlServer(builder.Configuration.GetConnectionString(localConnectionString),
                        sqlOptions => sqlOptions.CommandTimeout(120));
                });

            // add endpoints
            builder.Services.AddEndpointsApiExplorer();

            // add swagger
            builder.Services.AddSwaggerGen();

            builder.Services.ConfigureSwaggerGen(setup =>
            {
                setup.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "Book Management",
                    Version = "v1"
                });
            });

            var app = builder.Build();

            // seed database
            //using (var scope = app.Services.CreateScope())
            //{
            //    var services = scope.ServiceProvider;
            //    SeedData.Initialize(services);
            //}

            app.UseSwagger();
            app.UseSwaggerUI();

            // configure the HTTP request pipeline for swagger
            if (app.Environment.IsDevelopment())
            {
                app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.UseWebSockets();
            app.UseMiddleware<WebSocketMiddleware>();

            app.Run();
        }
    }
}