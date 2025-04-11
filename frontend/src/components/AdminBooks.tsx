import React, { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import axios from 'axios';

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    price: 0,
    description: '',
    imageUrl: '',
    stock: 0
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/books', newBook);
      setNewBook({
        title: '',
        author: '',
        price: 0,
        description: '',
        imageUrl: '',
        stock: 0
      });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    try {
      await axios.put(`/api/books/${editingBook.id}`, editingBook);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await axios.delete(`/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Books Management</h1>
      
      {/* Add New Book Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newBook.price}
            onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newBook.imageUrl}
            onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={newBook.stock}
            onChange={(e) => setNewBook({ ...newBook, stock: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Book
          </button>
        </form>
      </div>

      {/* Books List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Books List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="border p-4 rounded">
              {editingBook?.id === book.id ? (
                <form onSubmit={handleUpdateBook} className="space-y-2">
                  <input
                    type="text"
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                  <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="font-semibold">{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Price: ${book.price}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBooks; 