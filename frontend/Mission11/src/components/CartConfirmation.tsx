import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookTitle, ...preservedState } = location.state ?? {};
    const { items, removeFromCart, total } = useCart();

    return (
        <div className="container mt-5">
            <div className="alert alert-success">
                <h4 className="alert-heading">Added to Cart!</h4>
                {bookTitle && <p><strong>{bookTitle}</strong> has been added to your cart.</p>}
            </div>

            <h5>Cart Summary</h5>
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

            <button className="btn btn-primary mt-2" onClick={() => navigate('/', { state: preservedState })}>
                Continue Shopping
            </button>
        </div>
    );
}

export default CartConfirmation;
