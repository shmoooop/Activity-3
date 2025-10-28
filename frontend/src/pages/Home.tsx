import React, { useEffect, useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import ApiClient from '../utils/api';
import Bookcard from '../components/Bookcard';
// Import the central type
import type { Book } from '../utils/normalize';
import LibrarySection from '../components/LibrarySection'; 

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

type HomeProps = {
  searchQuery?: string;
};

export default function Home({ searchQuery }: HomeProps) {
  const query = useQuery();
  const navigate = useNavigate();
  const urlSearch = query.get('search') || '';
  const effectiveSearch = (searchQuery !== undefined ? searchQuery : urlSearch).trim();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLibraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (!effectiveSearch) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      ApiClient.get(`/books?search=${encodeURIComponent(effectiveSearch)}`)
        .then(res => {
          if (cancelled) return;
          setBooks(res.data || []);
          setLoading(false);
        })
        .catch(err => {
          if (cancelled) return;
          console.error('Search failed', err);
          setError('Failed to load search results');
          setLoading(false);
        });
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [effectiveSearch]);

  if (!effectiveSearch) {
    return (
      <> 
        <div className="home-landing">
          <div className="main-content-card home-welcome-card">
            {/* 1. Replaced inline style with a className */}
            <div className="welcome-and-search">
              <div className="welcome-header" style={{ textAlign: 'center' }}>
                <div className="text-container">
                  <h2> Welcome to the Library ☕︎ </h2>
                  <p className="text-muted">Manage and explore your digital book collection</p>
                </div>
              </div>
              
              {/* 2. Replaced inline style with utility classes */}
              <div className="form-actions justify-content-center mt-3">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setLibraryOpen(!isLibraryOpen)}
                  aria-expanded={isLibraryOpen}
                >
                  {isLibraryOpen ? ' Hide Library' : ' View My Library'}
                </button>
              </div>

            </div>
          </div>
        </div>

        <div className={`library-collapse-section main-content-card ${isLibraryOpen ? 'open' : ''}`}>
          <LibrarySection />
        </div>
        
      </> 
    );
  }

  return (
    <div className="main-content-card books-search-results">
      <div className="search-results-header">
        <div className="text-container">
          <h2>Search results</h2>
          <p className="text-muted">Results for "{effectiveSearch}"</p>
        </div>
        {/* 3. Replaced inline style with utility class */}
        <div className="mt-2">
          <button className="btn" onClick={() => navigate('/')}>Clear search</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="text-container">
            <p className="text-muted">Searching...</p>
          </div>
        </div>
      ) : error ? (
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <div className="text-container">
            <h2>Error</h2>
            <p className="text-muted">{error}</p>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <div className="text-container">
            <h3>No results</h3>
            <p className="text-muted">No books matched your search. Try different keywords.</p>
          </div>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(b => (
            <Bookcard key={b.id} book={b} showActions={true} className="book-grid-card" />
          ))}
        </div>
      )}
    </div>
  );
}