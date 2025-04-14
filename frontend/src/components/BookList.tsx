import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [sortTitles, setSortTitles] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const categoryParams = selectedCategories
          .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
          .join('&');

        const response = await fetch(
          `https://localhost:5000/book/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortTitles=${sortTitles}${selectedCategories.length ? `&${categoryParams}` : ''}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data.books || []);
        setTotalBooks(data.totalNumBooks || 0);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, sortTitles, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));

  const handleAddToCart = (book: Book) => {
    const cartItem: CartItem = {
      bookId: book.bookID,
      bookTitle: book.title,
      bookQuantity: 1,
      bookPrice: book.price,
    };
    addToCart(cartItem);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {/* Toast Notification */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          className={`toast ${showToast ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Cart Update</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            Book added to cart successfully!
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        {books.length === 0 ? (
          <p>No books found matching your criteria.</p>
        ) : (
          books.map((book) => (
            <div id="projectCard" className="card p-3" key={book.bookID}>
              <h3 className="card-title">{book.title}</h3>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li><strong>Author:</strong> {book.author}</li>
                  <li><strong>Publisher:</strong> {book.publisher}</li>
                  <li><strong>ISBN:</strong> {book.isbn}</li>
                  <li><strong>Classification:</strong> {book.classification}</li>
                  <li><strong>Category:</strong> {book.category}</li>
                  <li><strong>Number of Pages:</strong> {book.pageCount}</li>
                  <li><strong>Price:</strong> ${book.price.toFixed(2)}</li>
                </ul>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/buy/${book.title}/${book.bookID}/${book.price}`)}
                  >
                    Buy
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination buttons */}
      <div className="mt-4 d-flex justify-content-center gap-2">
        <button
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setPageNum(index + 1)}
            disabled={pageNum === index + 1}
            className="btn btn-outline-secondary"
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      {/* Controls Section */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-3">
          <Row className="align-items-center g-3">
            <Col md={6}>
              <Form.Group className="d-flex align-items-center gap-3">
                <Form.Label className="mb-0 fw-bold text-muted">Results per page:</Form.Label>
                <Form.Select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNum(1);
                  }}
                  className="w-auto shadow-sm"
                  style={{ minWidth: '80px' }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="text-md-end">
              <Button
                variant={sortTitles ? "primary" : "outline-primary"}
                onClick={() => setSortTitles(!sortTitles)}
                className="d-flex align-items-center gap-2 shadow-sm"
              >
                <i className={`bi bi-sort-alpha-${sortTitles ? 'down' : 'up'}`}></i>
                Sort by Title
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default BookList;