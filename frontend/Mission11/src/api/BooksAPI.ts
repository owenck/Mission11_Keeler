import type { Book } from '../types/Book';

const API_BASE = 'https://mission13backend-dfg7chezb0g9dkdd.eastus-01.azurewebsites.net/api/books';

export async function fetchBooks(
    pageNum: number,
    numBooks: number,
    sortAsc: boolean,
    categories: string[]
): Promise<{ books: Book[]; totalBooks: number }> {
    const categoryParams = categories.map(c => `&categories=${encodeURIComponent(c)}`).join('');
    const res = await fetch(`${API_BASE}?pageNum=${pageNum}&numBooks=${numBooks}&sortAsc=${sortAsc}${categoryParams}`);
    return res.json();
}

export async function fetchCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
}

export async function addBook(book: Omit<Book, 'bookId'>): Promise<Book> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    return res.json();
}

export async function updateBook(id: number, book: Book): Promise<Book> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    return res.json();
}

export async function deleteBook(id: number): Promise<void> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
}
