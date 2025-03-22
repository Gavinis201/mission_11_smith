using Microsoft.EntityFrameworkCore;

namespace Mission_11.API.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        { 
        }

        // Books Table
        public DbSet<Book> Books { get; set; }
    }
}
