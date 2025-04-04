using Microsoft.AspNetCore.Mvc;
using Mission11.Data;

namespace Mission11.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext; // Liaison to database

        public BookController(BookDbContext temp)
        {
            _bookContext = temp; // Create liaison to database
        }

        [HttpGet("AllBooks")]
        // Returns list of books and the total number of books in JSON format
        // The list returned depends on pageSize, pageNum, and sortTitles
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, bool sortTitles = false, [FromQuery] List<string>? bookCategories = null)
        {
            IEnumerable<Book> bookList;

            var query = _bookContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            int totalNumBooks = query.Count();

            if (sortTitles) // If input asks to sort titles
            {
                bookList = query.OrderBy(x => x.Title)
                    .Skip((pageNum - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
            }
            else // If input does not ask to sort titles
            {
                bookList = query
                    .Skip((pageNum-1)*pageSize)
                    .Take(pageSize)
                    .ToList();
            }

            var returnObject = new
            {
                books = bookList,
                totalNumBooks = totalNumBooks
            };

            return Ok(returnObject);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            List<string> bookCategories = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }
    }
}