import './App.css';
import BooksPage from './pages/BooksPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyPage from './pages/BuyPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <>
      <CartProvider>
        {/* CartProvider tag carries cart information across all pages */}
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />}></Route>
            <Route
              path="/buy/:bookTitle/:bookId/:bookPrice"
              element={<BuyPage />}
            ></Route>
            <Route path="/books" element={<BooksPage />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/adminbooks" element={<AdminBooksPage />}></Route>
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;