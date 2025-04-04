import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import WelcomeBand from '../components/WelcomeBand';
import { useState } from 'react';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.bookPrice * item.bookQuantity, // Multiply bookPrice by bookQuantity to get subtotals
    0
  );

  const handleRemoveFromCart = (bookId: number) => {
    removeFromCart(bookId);
    setShowAlert(true); // Show the alert
    setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
  };

  return (
    <>
      <WelcomeBand />
      <br />
      <div>
        <h2>Your Cart</h2>

        {/* Book Removal Success Alert */}
        {showAlert && (
          <div className="alert alert-success" role="alert">
            Book successfully removed from the cart!
          </div>
        )}

        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="list-unstyled">
              {cart.map((item: CartItem) => (
                <li key={item.bookId} className="card p-3">
                  <h4>{item.bookTitle}</h4>
                  <ul className="list-unstyled">
                    <li>Quantity: {item.bookQuantity}</li>
                    <li>Price: ${item.bookPrice.toFixed(2)}</li>
                    <li>
                      Subtotal: $
                      {(item.bookQuantity * item.bookPrice).toFixed(2)}
                    </li>
                  </ul>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={() => handleRemoveFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
        <button>Checkout</button>
        <button onClick={() => navigate('/books')}>Continue Browsing</button>
      </div>
    </>
  );
}

export default CartPage;