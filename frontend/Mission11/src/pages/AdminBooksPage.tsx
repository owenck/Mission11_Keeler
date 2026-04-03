import React, { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/BooksAPI';

const emptyBook = (): Omit<Book, 'bookId'> => ({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
});

function BookForm({
    values,
    onChange,
    onSubmit,
    submitLabel,
    onCancel,
}: {
    values: Omit<Book, 'bookId'>;
    onChange: (updated: Omit<Book, 'bookId'>) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    onCancel: () => void;
}) {
    const fields: (keyof Omit<Book, 'bookId'>)[] = [
        'title', 'author', 'publisher', 'isbn', 'classification', 'category', 'pageCount', 'price',
    ];
    return (
        <form onSubmit={onSubmit} className="row g-2 mb-3">
            {fields.map((field) => (
                <div className="col-6 col-md-3" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                        className="form-control form-control-sm"
                        type={field === 'pageCount' || field === 'price' ? 'number' : 'text'}
                        step={field === 'price' ? '0.01' : undefined}
                        value={values[field] as string | number}
                        onChange={(e) =>
                            onChange({
                                ...values,
                                [field]:
                                    field === 'pageCount'
                                        ? parseInt(e.target.value) || 0
                                        : field === 'price'
                                        ? parseFloat(e.target.value) || 0
                                        : e.target.value,
                            })
                        }
                        required
                    />
                </div>
            ))}
            <div className="col-12 mt-2">
                <button type="submit" className="btn btn-primary btn-sm me-2">
                    {submitLabel}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [newBook, setNewBook] = useState<Omit<Book, 'bookId'>>(emptyBook());
    const [showAddForm, setShowAddForm] = useState(false);

    async function loadBooks() {
        const data = await fetchBooks(1, 1000, true, []);
        setBooks(data.books);
    }

    useEffect(() => {
        loadBooks();
    }, []);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        await addBook(newBook);
        setNewBook(emptyBook());
        setShowAddForm(false);
        loadBooks();
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editingBook) return;
        await updateBook(editingBook.bookId, editingBook);
        setEditingBook(null);
        loadBooks();
    }

    async function handleDelete(id: number) {
        if (!window.confirm('Delete this book?')) return;
        await deleteBook(id);
        loadBooks();
    }

    return (
        <div className="container mt-4">
            <h2>Admin — Manage Books</h2>

            <button
                className="btn btn-success mb-3"
                onClick={() => {
                    setShowAddForm(!showAddForm);
                    setEditingBook(null);
                }}
            >
                {showAddForm ? 'Hide Form' : 'Add New Book'}
            </button>

            {showAddForm && (
                <div className="card p-3 mb-4">
                    <h5>New Book</h5>
                    <BookForm
                        values={newBook}
                        onChange={setNewBook}
                        onSubmit={handleAdd}
                        submitLabel="Add Book"
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped table-hover table-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>ISBN</th>
                            <th>Classification</th>
                            <th>Category</th>
                            <th>Pages</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <React.Fragment key={book.bookId}>
                                <tr>
                                    <td>{book.bookId}</td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.publisher}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.classification}</td>
                                    <td>{book.category}</td>
                                    <td>{book.pageCount}</td>
                                    <td>${book.price.toFixed(2)}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-1"
                                            onClick={() => {
                                                setEditingBook(book);
                                                setShowAddForm(false);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(book.bookId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {editingBook?.bookId === book.bookId && (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="card p-3">
                                                <h6>Edit Book #{book.bookId}</h6>
                                                <BookForm
                                                    values={editingBook}
                                                    onChange={(updated) =>
                                                        setEditingBook({ ...updated, bookId: editingBook.bookId })
                                                    }
                                                    onSubmit={handleUpdate}
                                                    submitLabel="Save Changes"
                                                    onCancel={() => setEditingBook(null)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminBooksPage;
