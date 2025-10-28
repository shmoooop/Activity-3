import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../utils/api';
import Bookcard from '../components/Bookcard';
// 1. IMPORT our central types and functions
import { normalizeBook } from '../utils/normalize';
import type { Book } from '../utils/normalize';

export default function LibrarySection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const booksPerPage = 12;
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to first page when search changes
  };
  
  // 2. REMOVED the unused 'handleDeleteBook' function.
  // The Bookcard in this component only shows a "View" modal.

  useEffect(() => {
    ApiClient.get('/books')
      .then(response => {
        const raw = response.data || [];
        // 3. USE the imported 'normalizeBook' function
        const normalized = raw.map((b: any) => normalizeBook(b));
        setBooks(normalized);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load books');
        setLoading(false);
        console.error('Error fetching books:', err);
      });
  // 4. CHANGED dependency array to [] so this runs only once on mount.
  }, []); 

  // 5. REMOVED the local 'normalizeBook' function.

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="text-muted">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <span className="empty-icon">⚠️</span>
        <h2>Error</h2>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="empty-state"> {/* Changed class for consistency */}
        <span className="empty-icon">☹</span>
        <h3>No Books Found</h3>
        <p className="text-muted">Your library is empty. Start by adding some books!</p>
      </div>
    );
  }

  // Calculate pagination
  const filteredBooks = books.filter(book => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const title = (book.title ?? '').toString().toLowerCase();
    const author = (book.author?.name ?? '').toString().toLowerCase();
    const category = (book.category?.name ?? '').toString().toLowerCase();
    return title.includes(q) || author.includes(q) || category.includes(q);
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="books-view-page fade-in"> 
      <div className="books-header">
        <div className="books-header-content">
          <h2>My Library</h2>
          <p className="text-muted">Browse through your collection of books</p>
        </div>
      </div>

      <div className="search-pill-wrap">
        <div className="search-pill" role="search">
          <input
            aria-label="Search library books"
            className="search-input"
            placeholder="Filter by title, author, or category"
            value={searchQuery}
            onChange={handleSearchChange}
            type="search"
          />
          <div className="search-pill-actions">
            <button
              type="button"
              className="btn btn-secondary icon-only" // Use secondary for monochrome
              aria-label="Filter books"
              title="Filter"
              disabled={searchQuery.trim() === ''}
            >
              <span className="btn-icon" aria-hidden>🔍︎</span>
            </button>
          </div>
        </div>
      </div>

      <div className="books-grid">
        {currentBooks.map(book => (
          <Bookcard
            key={book.id}
            book={book}
            showActions={true}
            className="book-grid-card"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              type="button"
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}