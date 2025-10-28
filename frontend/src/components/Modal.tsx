import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

// We'll use a unique ID for the title for accessibility
const MODAL_TITLE_ID = 'modal-title';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(isOpen);
  const [closing, setClosing] = useState<boolean>(false);

  // This keydown logic is great, no changes needed
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  // This animation logic is also perfect, no changes needed
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => dialogRef.current?.focus(), 0);
      return;
    }
    if (visible) {
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        setClosing(false);
        previouslyFocused.current?.focus();
      }, 220); // 220ms matches our new CSS animation
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  // We add the size class directly
  const sizeClass = `modal-dialog--${size}`;
  const overlayClass = `modal-overlay${closing ? ' closing' : ''}`;
  const dialogClass = `modal-dialog ${sizeClass}${closing ? ' closing' : ''}`;

  return createPortal(
    <div
      ref={overlayRef}
      className={overlayClass}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={MODAL_TITLE_ID} // Better for accessibility
        tabIndex={-1}
        className={dialogClass}
      >
        <div className="modal-header">
          <h3 id={MODAL_TITLE_ID} className="modal-title">{title}</h3>
          <button aria-label="Close dialog" type="button" onClick={onClose} className="modal-close-btn">
            {/* Using a real '×' character is cleaner */}
            &times;
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}