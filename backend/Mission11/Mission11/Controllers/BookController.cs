using Microsoft.AspNetCore.Mvc;
using Mission11.Data;

namespace Mission11.Controllers
{
    // Defines the route for the controller: URL will be based on [controller] (e.g., /Book)
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        // Access to the database context for interacting with the Books table
        private BookDbContext _bookContext; 

        // Constructor to inject the database context
        public BookController(BookDbContext temp)
        {
            _bookContext = temp; 
        }

        // GET: /Book/AllBooks
        // Returns a paginated list of books and the total count
        // Optional query parameters:
        // - pageSize: number of books per page (default 5)
        // - pageNum: current page number (default 1)
        // - sortTitles: whether to sort books alphabetically by title
        // - bookCategories: optional filter by a list of book categories
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, bool sortTitles = false, [FromQuery] List<string>? bookCategories = null)
        {
            IEnumerable<Book> bookList;

            // Start with the full list of books
            var query = _bookContext.Books.AsQueryable();

            // If categories are provided, filter the list
            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            // Count total books after filtering
            int totalNumBooks = query.Count();

            // If requested, sort the books by title
            if (sortTitles) 
            {
                bookList = query.OrderBy(x => x.Title)
                    .Skip((pageNum - 1) * pageSize) // Skip books for previous pages
                    .Take(pageSize)                // Take books for current page
                    .ToList();
            }
            else // If not sorting
            {
                bookList = query
                    .Skip((pageNum-1)*pageSize)
                    .Take(pageSize)
                    .ToList();
            }

            // Create an anonymous object with books and total count
            var returnObject = new
            {
                books = bookList,
                totalNumBooks = totalNumBooks
            };

            return Ok(returnObject);
        }

        // GET: /Book/GetBookCategories
        // Returns a distinct list of all book categories
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            List<string> bookCategories = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }

        // POST: /Book/AddBook
        // Adds a new book to the database
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        // PUT: /Book/UpdateBook/{bookId}
        // Updates an existing book in the database
        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            // Find the existing book by its ID
            Book existingBook = _bookContext.Books.Find(bookId);

            // Update all relevant fields
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        // DELETE: /Book/DeleteBook/{bookId}
        // Deletes a book by ID
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            // Look for the book in the database
            Book book = _bookContext.Books.Find(bookId);

            // If not found, return 404
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            // Remove the book and save changes
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent(); // 204 status code, no response body
        }
    }
}
