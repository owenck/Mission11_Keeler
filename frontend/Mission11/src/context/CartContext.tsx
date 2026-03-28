import { createContext, useContext, useState } from 'react';
import type { CartItem } from '../types/CartItem';
import type { Book } from '../types/Book';

interface CartContextType {
    items: CartItem[];
    addToCart: (book: Book) => void;
    removeFromCart: (bookId: number) => void;
    total: number;
    totalQuantity: number;
}

const CartContext = createContext<CartContextType | null>(null);

function loadFromSession(): CartItem[] {
    const stored = sessionStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
}

function saveToSession(items: CartItem[]) {
    sessionStorage.setItem('cart', JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadFromSession);

    function addToCart(book: Book) {
        setItems(prev => {
            const existing = prev.find(i => i.bookId === book.bookId);
            const updated = existing
                ? prev.map(i => i.bookId === book.bookId ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { bookId: book.bookId, title: book.title, price: book.price, quantity: 1 }];
            saveToSession(updated);
            return updated;
        });
    }

    function removeFromCart(bookId: number) {
        setItems(prev => {
            const updated = prev.filter(i => i.bookId !== bookId);
            saveToSession(updated);
            return updated;
        });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, total, totalQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
