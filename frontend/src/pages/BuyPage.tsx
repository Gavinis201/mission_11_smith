// Import necessary hooks and components
import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState } from 'react';

function BuyPage() {
  const navigate = useNavigate(); // Used to programmatically navigate between pages
  const { bookTitle, bookId, bookPrice } = useParams(); // Retrieve route parameters for the book being purchased
  const { addToCart } = useCart(); // Access the addToCart function from CartContext
  const [bookQuantity, setBookQuantity] = useState<number>(1); // State to manage the quantity being purchased

  // Handler to add item to the cart and navigate to the cart page
  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId), // Ensure it's a number
      bookTitle: bookTitle || 'No Title Found', // Fallback title
      bookQuantity, // User-selected quantity
      bookPrice: Number(bookPrice), // Ensure it's a number
    };
    addToCart(newItem); // Add item to cart
    navigate('/cart'); // Redirect to the cart page
  };

  return (
    <>
      <div className="container">
        {/* Top banner */}
        <div className="row mb-3">
          <WelcomeBand />
        </div>

        {/* Book title and price */}
        <h2>Buy {bookTitle}</h2>
        <h4>Price: ${Number(bookPrice).toFixed(2)}</h4>

        {/* Quantity input and Add To Cart button */}
        <div>
          <input
            type="number"
            value={bookQuantity}
            onChange={(x) => setBookQuantity(Number(x.target.value) || 1)} // Prevent NaN and default to 1
            min="1" // Restrict negative or zero values
          />
          <button className="btn btn-primary ms-2" onClick={handleAddToCart}>
            Add To Cart
          </button>
        </div>

        {/* Back button to go to previous page */}
        <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </>
  );
}

export default BuyPage;
