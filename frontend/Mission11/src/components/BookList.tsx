import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';

interface BookListProps {
    selectedCategories: string[];
    pageNum: number;
    setPageNum: (page: number) => void;
    numBooks: number;
    setNumBooks: (n: number) => void;
    sortAsc: boolean;
    setSortAsc: (asc: boolean) => void;
}

function BookList({ selectedCategories, pageNum, setPageNum, numBooks, setNumBooks, sortAsc, setSortAsc }: BookListProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const categoryParams = selectedCategories.map(c => `&categories=${encodeURIComponent(c)}`).join('');
        fetch(`https://localhost:5001/api/book?pageNum=${pageNum}&numBooks=${numBooks}&sortAsc=${sortAsc}${categoryParams}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.books);
                setTotalBooks(data.totalBooks);
            });
    }, [pageNum, numBooks, sortAsc, selectedCategories]);

    const totalPages = Math.ceil(totalBooks / numBooks);

    function handleAddToCart(book: Book) {
        addToCart(book);
        navigate('/cart-confirmation', {
            state: {
                bookTitle: book.title,
                preserved: true,
                selectedCategories,
                pageNum,
                numBooks,
                sortAsc,
            }
        });
    }

    return (
        <div className="mt-4 pb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h1>Bookstore</h1>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSortAsc(!sortAsc)}>
                    Sort by Title {sortAsc ? '▲' : '▼'}
                </button>
            </div>

            {/* #1 & #3 — responsive card grid with nested grid inside each card */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                {books.map(book => (
                    <div key={book.bookId} className="col">
                        <div className="card h-100">
                            <div className="card-body">
                                <h6 className="card-title">{book.title}</h6>
                                <p className="card-text text-muted mb-1">{book.author}</p>
                                <p className="card-text mb-1"><small>{book.category}</small></p>

                                {/* #3 — nested grid for price and pages */}
                                <div className="row mt-2">
                                    <div className="col-6">
                                        <small className="text-muted">Price</small>
                                        <div className="fw-bold">${book.price.toFixed(2)}</div>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted">Pages</small>
                                        <div className="fw-bold">{book.pageCount}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary btn-sm w-100" onClick={() => handleAddToCart(book)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                <nav>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPageNum(page)}>{page}</button>
                            </li>
                        ))}
                        <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>Next</button>
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
