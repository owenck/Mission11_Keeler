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
public IActionResult GetBooks(int numBooks = 5, int pageNum = 1, bool sortAsc = true)
{
    var query = _context.Books.AsQueryable();

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

}
