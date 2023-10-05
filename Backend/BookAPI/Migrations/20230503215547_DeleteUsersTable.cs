using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab3BookAPI.Migrations
{
    /// <inheritdoc />
    public partial class DeleteUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropTable(
                name: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
