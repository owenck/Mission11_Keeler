import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [numBooks, setNumBooks] = useState(5);
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5174/api/book?pageNum=${pageNum}&numBooks=${numBooks}&sortAsc=${sortAsc}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.books);
                setTotalBooks(data.totalBooks);
            });
    }, [pageNum, numBooks, sortAsc]);

    const totalPages = Math.ceil(totalBooks / numBooks);

    return (
        <div className="container mt-4">
            <h1>Bookstore</h1>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{cursor:'pointer'}} onClick={() => setSortAsc(!sortAsc)}>
                            Title {sortAsc ? '▲' : '▼'}
                        </th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.bookId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex align-items-center gap-2 flex-wrap">
                <nav>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPageNum(p => p - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPageNum(page)}>{page}</button>
                            </li>
                        ))}
                        <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPageNum(p => p + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>

                <select className="form-select w-auto" value={numBooks} onChange={e => { setNumBooks(Number(e.target.value)); setPageNum(1); }}>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                </select>
            </div>
        </div>
    );
}

export default BookList;
