using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Keeler.Data;
using Mission11_Keeler.Models;

namespace Mission11_Keeler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public BookController(AppDbContext context)
    {
        _context = context;
    }
    

[HttpGet]
public IActionResult GetBooks(int numBooks = 5, int pageNum = 1, bool sortAsc = true, [FromQuery] string[]? categories = null)
{
    var query = _context.Books.AsQueryable();

    if (categories != null && categories.Length > 0)
        query = query.Where(b => categories.Contains(b.Category));

    query = sortAsc
        ? query.OrderBy(b => b.Title)
        : query.OrderByDescending(b => b.Title);

    var totalBooks = query.Count();
    var books = query
        .Skip((pageNum - 1) * numBooks)
        .Take(numBooks)
        .ToList();

    return Ok(new { books, totalBooks });
}

[HttpGet("categories")]
public IActionResult GetCategories()
{
    var categories = _context.Books
        .Select(b => b.Category)
        .Distinct()
        .OrderBy(c => c)
        .ToList();

    return Ok(categories);
}

[HttpPost]
public IActionResult AddBook([FromBody] Book book)
{
    _context.Books.Add(book);
    _context.SaveChanges();
    return CreatedAtAction(nameof(GetBooks), new { id = book.BookId }, book);
}

[HttpPut("{id}")]
public IActionResult UpdateBook(int id, [FromBody] Book book)
{
    var existing = _context.Books.Find(id);
    if (existing == null) return NotFound();

    existing.Title = book.Title;
    existing.Author = book.Author;
    existing.Publisher = book.Publisher;
    existing.Isbn = book.Isbn;
    existing.Classification = book.Classification;
    existing.Category = book.Category;
    existing.PageCount = book.PageCount;
    existing.Price = book.Price;

    _context.SaveChanges();
    return Ok(existing);
}

[HttpDelete("{id}")]
public IActionResult DeleteBook(int id)
{
    var book = _context.Books.Find(id);
    if (book == null) return NotFound();

    _context.Books.Remove(book);
    _context.SaveChanges();
    return NoContent();
}

}
