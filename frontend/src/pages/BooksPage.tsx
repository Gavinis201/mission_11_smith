// Import React functionality, components, and context
import { useState } from 'react';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function BooksPage() {
  // Tracks which book categories are selected for filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Tracks whether the cart offcanvas panel is visible
  const [showCart, setShowCart] = useState<boolean>(false);

  // Access cart and cart functions from context
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="container">
      {/* Header area */}
      <WelcomeBand />
      <br />

      <div className="row">
        {/* Left-side: Category filters */}
        <div className="col-3">
          <div className="position-sticky" style={{ top: '20px' }}>
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </div>

        {/* Right-side: Book list and cart button */}
        <div className="col-9">
          <div className="d-flex justify-content-end mb-3">
            {/* Cart button that opens the offcanvas */}
            <button
              className="btn btn-info"
              onClick={() => setShowCart(true)}
            >
              View Cart ({cart.length}) {/* Shows total items in cart */}
            </button>
          </div>

          {/* Main book list filtered by selected categories */}
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>

      {/* Bootstrap offcanvas component for the shopping cart */}
      <div
        className={`offcanvas offcanvas-end ${showCart ? 'show' : ''}`}
        tabIndex={-1}
        id="offcanvasCart"
        aria-labelledby="offcanvasCartLabel"
        style={{ visibility: showCart ? 'visible' : 'hidden' }} // manually control visibility
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
          {/* Message if cart is empty */}
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {/* Loop through each item in the cart */}
              {cart.map((item) => (
                <div key={item.bookId} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6>{item.bookTitle}</h6>
                    <p>Price: ${item.bookPrice.toFixed(2)} x {item.bookQuantity}</p>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Buttons to clear cart or proceed to checkout */}
              <div className="mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button
                  className="btn btn-success ms-2"
                  onClick={() => setShowCart(false)} // Placeholder for future checkout action
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom backdrop that closes the cart if clicked */}
      {showCart && <div className="offcanvas-backdrop fade show" onClick={() => setShowCart(false)}></div>}
    </div>
  );
}

export default BooksPage;
