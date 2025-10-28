import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../utils/api';

export default function AddBook(){
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');

  // 1. Add a submitting state and error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Convert onSubmit to async/await with try/catch
  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setIsSubmitting(true); // Disable buttons
    setError(null);

    try {
      await ApiClient.post('/books', {
        title,
        author: { name: authorName },
        category: { name: categoryName },
        year: year ? parseInt(year) : undefined,
        description
      });
      navigate('/'); // Go home on success
    } catch (err) {
      console.error(err);
      setError('Failed to add book. Please try again.');
      setIsSubmitting(false); // Re-enable buttons on error
    }
  }

  const handleClear = () => {
    setTitle('');
    setAuthorName('');
    setCategoryName('');
    setYear('');
    setDescription('');
    setError(null);
  };

  return (
    <div className="main-content-card">
      <h2 className="text-center mb-4">✚ Add New Book</h2>
      <div className="form-container">
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            {/* Form fields are unchanged */}
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
          
          {/* 3. Add error message and disable buttons */}
          {error && (
            <div className="error-message" style={{textAlign: 'center', marginBottom: '16px'}}>
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClear}
              disabled={isSubmitting}
            >
              Clear Form
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : '✚ Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}