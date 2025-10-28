import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ApiClient from '../utils/api';
// We'll import our new central function
import { normalizeBook } from '../utils/normalize';

export default function EditBook(){
  const navigate = useNavigate();
  const { id } = useParams(); // Get the book ID from the URL

  // Form state
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No book ID provided.");
      setLoading(false);
      return;
    }

    ApiClient.get(`/books/${id}`)
      .then(res => {
        const book = normalizeBook(res.data); // Use the normalize function
        // Populate the form state
        setTitle(book.title || '');
        setAuthorName(book.author?.name || '');
        setCategoryName(book.category?.name || '');
        setYear(book.year ? String(book.year) : '');
        setDescription(book.description || '');

        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading book:", err); // Log the error
        setError("Failed to load book data. It may not exist.");
        setLoading(false);
      });
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      // --- THIS IS THE FIX ---
      await ApiClient.patch(`/books/${id}`, { // Changed put to patch
      // -----------------------
        title,
        // Send author/category objects, not just names
        author: { name: authorName },
        category: { name: categoryName },
        year: year ? parseInt(year) : undefined,
        description
      });
      // Go back to the detail page after saving
      navigate(`/books/${id}`);
    } catch (err) {
      console.error('Update failed:', err); // Log the actual error
      // Check if the error response has specific messages
      const errorMsg = (err as any)?.response?.data?.message || 'Please try again.';
      setError(`Failed to save changes. ${Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content-card">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="text-muted">Loading book for editing...</p>
        </div>
      </div>
    );
  }

  if (error && !isSubmitting) { // Only show full error page if not actively submitting
    return (
      <div className="main-content-card">
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <h2>Error</h2>
          <p className="text-muted">{error}</p>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <Link to="/" className="btn btn-secondary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // If loading is done, but the book couldn't be fetched (and it's not a submission error)
  if (!loading && !isSubmitting && !title && !error) {
     return (
       <div className="main-content-card">
         <div className="empty-state">
           <span className="empty-icon">⚠️</span>
           <h2>Book Not Found</h2>
           <p className="text-muted">Could not load data for the requested book.</p>
           <div className="form-actions" style={{ justifyContent: 'center' }}>
             <Link to="/" className="btn btn-secondary">Go Home</Link>
           </div>
         </div>
       </div>
     );
  }


  return (
    <div className="main-content-card">
      <h2 className="text-center mb-4">✎ Edit Book</h2>
      <div className="form-container">
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-group form-group--full">
              <label htmlFor="title" className="form-label">Title <span className="required">*</span></label>
              <input
                id="title"
                className="form-control"
                value={title}
                onChange={e=>setTitle(e.target.value)}
                required
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author" className="form-label">Author <span className="required">*</span></label>
              <input
                id="author"
                className="form-control"
                value={authorName}
                onChange={e=>setAuthorName(e.target.value)}
                required
                placeholder="Author name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                id="category"
                className="form-control"
                value={categoryName}
                onChange={e=>setCategoryName(e.target.value)}
                placeholder="Book category"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year" className="form-label">Year</label>
              <input
                id="year"
                type="number"
                className="form-control"
                value={year}
                onChange={e=>setYear(e.target.value)}
                placeholder="Publication year"
              />
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={e=>setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={4}
              ></textarea>
            </div>
          </div>

          {/* Show submission error below the form */}
          {error && isSubmitting && (
            <div className="error-message" style={{textAlign: 'center', marginBottom: '16px'}}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              // Navigate back to detail page if ID exists, otherwise home
              onClick={() => navigate(id ? `/books/${id}` : '/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}