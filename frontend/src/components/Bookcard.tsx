import React, { useState } from 'react';
import Modal from './Modal';
// 1. IMPORT the central Book type
import type { Book } from '../utils/normalize';

// 2. REMOVED the old local types:
// type Author = ...
// type Category = ...
// export type Book = ...

type BookcardProps = {
  book: Book; // This 'Book' is now the central type
  showActions?: boolean;
  className?: string;
};

export default function Bookcard({ book, showActions = true, className = '' }: BookcardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleView = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false); 

  return (
    <div className={`book-card ${className}`.trim()}>
      <div className="book-card__content">
        <div className="book-card__title">{book.title}</div>

        <div className="book-card__meta small" style={{ marginTop: 4 }}>
          by {book.author?.name ?? 'Unknown'} · {book.category?.name ?? 'Uncategorized'}{book.year ? ` · ${book.year}` : ''}
        </div>

        {book.description ? (
          <p className="book-description">{book.description}</p>
        ) : null}

        {showActions && (
          <div className="book-card__actions">
            <button className="btn btn-secondary" onClick={handleView} type="button">View</button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        title={book.title} 
        size="sm"
      >
        <div style={{ textAlign: 'left', paddingTop: 8 }}>
          <div style={{ marginBottom: 8, color: 'var(--muted)' }}>
            <strong>Author:</strong> {book.author?.name ?? 'Unknown'}
            <br />
            <strong>Category:</strong> {book.category?.name ?? 'Uncategorized'}{book.year ? ` · ${book.year}` : ''}
          </div>

          {book.description ? (
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: '8px 0' }}>Description</h4>
              <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.6 }}>{book.description}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--muted)' }}>No description available.</p>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={handleClose} type="button">Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}