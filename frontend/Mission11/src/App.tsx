import { Routes, Route } from 'react-router-dom';
import BookstorePage from './pages/BookstorePage';
import CartConfirmation from './pages/CartConfirmation';
import CartPage from './pages/CartPage';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<BookstorePage />} />
            <Route path="/cart-confirmation" element={<CartConfirmation />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
    );
}

export default App;
