import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { DeleteBook, fetchBooks } from '../api/BooksAPI';
import { Container, Card, Form, Button, Row, Col, Table, Badge, Modal, InputGroup, Spinner, Alert } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortTitles, setSortTitles] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBooks(pageSize, pageNum, sortTitles, []);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageNum, pageSize, sortTitles]);

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await DeleteBook(bookId);
      setBooks(books.filter((b) => b.bookID !== bookId));
    } catch (error) {
      setError('Failed to delete book. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-5 fw-bold text-primary">Book Management</h1>
          <p className="text-muted">Manage your bookstore inventory</p>
        </div>
        <Button 
          variant="success" 
          onClick={() => setShowForm(true)}
          className="d-flex align-items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Add New Book
        </Button>
      </div>

   

      {/* Books Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3">Title</th>
                <th className="py-3">Author</th>
                <th className="py-3">Publisher</th>
                <th className="py-3">ISBN</th>
                <th className="py-3">Price</th>
                <th className="py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.bookID}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        {book.imageUrl && (
                          <img 
                            src={book.imageUrl} 
                            alt={book.title}
                            className="me-2"
                            style={{ width: '40px', height: '60px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div className="fw-bold">{book.title}</div>
                          <small className="text-muted">{book.classification}</small>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">{book.author}</td>
                    <td className="align-middle">{book.publisher}</td>
                    <td className="align-middle">{book.isbn}</td>
                    <td className="align-middle">
                      <span className="fw-bold text-primary">
                        ${book.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="align-middle text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => setEditingBook(book)}
                      >
                        <i className="bi bi-pencil-fill"></i> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(book.bookID)}
                      >
                        <i className="bi bi-trash-fill"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          pageNum={pageNum}
          pageSize={pageSize}
          totalPages={totalPages}
          sortTitles={sortTitles}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          onSortChange={setSortTitles}
        />
      </div>

      {/* New Book Form Modal */}
      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, sortTitles, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Book Form Modal */}
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNum, sortTitles, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}
    </Container>
  );
};

export default AdminBooksPage;