import { useState } from 'react';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="container">
      <WelcomeBand />
      <br />
      <div className="row">
        <div className="col-3">
          <div className="position-sticky" style={{ top: '20px' }}>
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </div>
        <div className="col-9">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-info"
              onClick={() => setShowCart(true)}
            >
              View Cart ({cart.length})
            </button>
          </div>
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>

      {/* Offcanvas for Cart */}
      <div
        className={`offcanvas offcanvas-end ${showCart ? 'show' : ''}`}
        tabIndex={-1}
        id="offcanvasCart"
        aria-labelledby="offcanvasCartLabel"
        style={{ visibility: showCart ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasCartLabel">Shopping Cart</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowCart(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.bookId} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6>{item.bookTitle}</h6> {/* Changed from item.title */}
                    <p>Price: ${item.bookPrice.toFixed(2)} x {item.bookQuantity}</p> {/* Changed from item.price */}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button
                  className="btn btn-success ms-2"
                  onClick={() => setShowCart(false)} // Placeholder for checkout
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {showCart && <div className="offcanvas-backdrop fade show" onClick={() => setShowCart(false)}></div>}
    </div>
  );
}

export default BooksPage;