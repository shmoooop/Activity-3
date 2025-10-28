import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ApiClient from '../utils/api';
// 1. IMPORT OUR TYPE AND FUNCTION
import { normalizeBook } from '../utils/normalize';
import type { Book } from '../utils/normalize';

export default function BookDetail() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. The local 'normalizeBook' function has been removed

  const handleDeleteBook = async (bookId: number | string | undefined, title: string) => {
    if (!bookId) return;
    if (!window.confirm(`Are you sure you want to delete the book: "${title}"? This cannot be undone.`)) {
        return;
    }
    try {
        setLoading(true);
        await ApiClient.delete(`/books/${bookId}`);
        navigate('/'); // Go home after delete
    } catch (err) {
        setError('Failed to delete book. Please try again.');
        setLoading(false); // Stay on page to show error
    }
  };

  useEffect(() => {
    if (id) {
      ApiClient.get(`/books/${id}`)
        .then(response => {
          const raw = response.data;
          if (raw) {
            // 3. We use the imported function here
            const normalized = normalizeBook(raw);
            setBook(normalized);
          } else {
            setBook(null);
            setError('Book not found.');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load book details');
          setLoading(false);
          console.error('Error fetching book:', err);
        });
    } else {
      setError('No book ID specified.');
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="main-content-card">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="text-muted">Loading book details...</p>
        </div>
      </div>
    );
  }

  // Combined error and not found state
  if (error || !book) {
    return (
      <div className="main-content-card">
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <h2>{error ? 'Error' : 'Book Not Found'}</h2>
          <p className="text-muted">{error || 'The requested book could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content-card book-detail-view">
      <div className="book-card-detailed">
        <div className="book-card-header">
          <div className="book-actions-top">
              {/* 4. This link now works perfectly! */}
              <Link to={`/edit/${book.id}`} className="btn btn-secondary">
                  <span aria-hidden>✎</span> Edit
              </Link>
              <button 
                  className="btn btn-danger" 
                  type="button" 
                  onClick={() => handleDeleteBook(book.id, book.title || 'Unknown Book')}
              >
                  <span aria-hidden>🗑</span> Delete
              </button>
          </div>

          <h1 className="book-title">{book.title}</h1>
          
          <div className="book-meta-info">
            <div className="author-info">
              <span className="label">Author:</span>
              <span className="value">{book.author?.name || 'Unknown Author'}</span>
            </div>
            <div className="category-info">
              <span className="label">Category:</span>
              <span className="value">{book.category?.name || 'Uncategorized'}</span>
            </div>
            {book.year && (
              <div className="year-info">
                <span className="label">Year:</span>
                <span className="value">{book.year}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="book-content">
          <div className="book-detail-visual">
              {book.image ? (
                  <div className="book-detail-placeholder">Image Placeholder</div>
              ) : (
                  <div className="book-detail-placeholder">No Cover Image</div>
              )}
          </div>

          <div className="description-section">
              {book.description && (
                <div>
                  <h3>Description</h3>
                  <p className="book-description">{book.description}</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}