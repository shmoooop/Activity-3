import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiClient from '../utils/api';
// We'll import our new central Book type
import type { Book } from '../utils/normalize'; 
import { normalizeBook } from '../utils/normalize';

const BookSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    const searchBooks = async () => {
      const q = searchTerm.trim();
      if (q === '') {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await ApiClient.get('/books');
        const allBooks = (response.data || []).map(normalizeBook); // Normalize all results
        const searchLower = q.toLowerCase();

        const mapped: Book[] = [];

        for (const book of allBooks) {
          if (book.title.toLowerCase().includes(searchLower)) {
            mapped.push({ ...book, matchedField: 'Title', matchedValue: book.title });
            continue;
          }
          if (book.author?.name.toLowerCase().includes(searchLower)) {
            mapped.push({ ...book, matchedField: 'Author', matchedValue: book.author.name });
            continue;
          }
          if (book.category?.name.toLowerCase().includes(searchLower)) {
            mapped.push({ ...book, matchedField: 'Category', matchedValue: book.category.name });
            continue;
          }
        }
        setSearchResults(mapped);

      } catch (err) {
        setError('Failed to search books. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchBooks, 150);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleDelete = async (bookId: number | string | undefined, title: string) => {
    if (!bookId) return;
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await ApiClient.delete(`/books/${bookId}`);
      setSearchResults(prev => prev.filter(b => b.id !== bookId));
    } catch (err) {
      setError('Failed to delete book. Please try again.');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
    setFocusedIndex(-1);
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && focusedIndex < searchResults.length) {
        e.preventDefault();
        const focusedItem = document.querySelector(`.search-result-item[data-index="${focusedIndex}"]`);
        const editLink = focusedItem?.querySelector('.btn.secondary') as HTMLAnchorElement;
        if (editLink) {
          editLink.click();
        }
      }
    }
  };

  return (
    <div className="main-content-card home-welcome-card edit-page" style={{ flexDirection: 'column' }}>
      
      <div className="welcome-header">
        <h2>✎ Manage Books</h2>
        <p className="text-muted">Use the search bar below to find a book to edit or delete.</p>
      </div>

      <div className="search-pill-wrap" style={{marginTop: '20px'}}>
        <div className="search-pill" role="search"> 
          <input
            aria-label="Search books"
            className="search-input"
            placeholder="Search by title, author, or category"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setFocusedIndex(-1); }}
            onKeyDown={onKeyDownInput}
            type="search"
          />
          <div className="search-pill-actions">
            {searchTerm.trim() !== '' && (
              <button
                  type="button"
                  className="btn btn-secondary icon-only"
                  aria-label="Clear search"
                  title="Clear search"
                  onClick={clearSearch}
              >
                  <span className="btn-icon" aria-hidden>✕</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary icon-only"
              aria-label="Search books"
              title="Search"
              onClick={() => {}}
              disabled={isLoading}
            >
              <span className="btn-icon" aria-hidden>🔍︎</span>
            </button>
          </div>
        </div>
      </div>

      {searchTerm.trim() === '' ? null : (
        <div className="search-results-container" style={{maxWidth: '840px', marginTop: '20px'}}>
          {error ? (
            <p className="error-message">{error}</p>
          ) : isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p className="text-muted">Searching...</p>
              </div>
          ) : searchResults.length === 0 ? (
            <p className="text-muted text-center" style={{ marginTop: 12 }}>No books found matching "{searchTerm}"</p>
          ) : (
            <>
              <div className="results-header" style={{ marginBottom: 12, padding: '0 8px' }}>
                <div className="text-muted" style={{ fontSize: 14 }}>
                  {`${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`}
                </div>
              </div>

              <div className="search-results">
                {searchResults.map((book, idx) => (
                  <div
                    key={book.id}
                    className="search-result-item"
                    style={focusedIndex === idx ? { boxShadow: '0 0 0 3px var(--focus-ring)' } : undefined}
                    onFocus={() => setFocusedIndex(idx)}
                    tabIndex={0}
                    data-index={idx}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p className="matched-label">{(book as any).matchedField ? `${(book as any).matchedField}:` : 'Title:'}</p>
                      <h3 className="book-title-only">{(book as any).matchedValue ?? book.title}</h3>
                    </div>
                    <div className="book-actions">
                      <Link
                        to={`/edit/${book.id}`}
                        className="btn secondary"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => handleDelete(book.id, book.title || 'Unknown')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;