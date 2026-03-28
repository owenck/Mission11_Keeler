import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSummary() {
    const { total, totalQuantity } = useCart();
    const navigate = useNavigate();

    return (
        <div style={{ position: 'fixed', top: '1rem', right: '1.5rem', zIndex: 1000 }}>
            <button className="btn btn-outline-primary" onClick={() => navigate('/cart')}>
                🛒 {totalQuantity} items — ${total.toFixed(2)}
            </button>
        </div>
    );
}

export default CartSummary;
