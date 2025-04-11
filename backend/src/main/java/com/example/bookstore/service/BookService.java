package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import com.example.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book book) {
        Optional<Book> existingBook = bookRepository.findById(id);
        if (existingBook.isPresent()) {
            Book updatedBook = existingBook.get();
            updatedBook.setTitle(book.getTitle());
            updatedBook.setAuthor(book.getAuthor());
            updatedBook.setPrice(book.getPrice());
            updatedBook.setDescription(book.getDescription());
            updatedBook.setImageUrl(book.getImageUrl());
            updatedBook.setStock(book.getStock());
            return bookRepository.save(updatedBook);
        }
        throw new RuntimeException("Book not found with id: " + id);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
} 