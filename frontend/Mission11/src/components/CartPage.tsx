import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
    const navigate = useNavigate();
    const { items, removeFromCart, total } = useCart();

    return (
        <div className="container mt-5">
            {/* #2 — offset columns to center the cart content */}
            <div className="row">
            <div className="col-md-8 offset-md-2">
            <h4>Your Cart</h4>

            {items.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
            ) : (
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.bookId}>
                                <td>{item.title}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.bookId)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}><strong>Total</strong></td>
                            <td colSpan={2}><strong>${total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            )}

            <button className="btn btn-primary mt-2" onClick={() => navigate(-1)}>
                Continue Shopping
            </button>
            </div>
            </div>
        </div>
    );
}

export default CartPage;
