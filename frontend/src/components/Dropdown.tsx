import React, { useState, useRef, useEffect } from 'react';

type DropdownProps = {
  label?: string;
  children?: React.ReactNode;
  isIconButton?: boolean; // New prop to differentiate styling
};

export default function Dropdown({ label = 'Menu', children, isIconButton = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      const first = menuRef.current?.querySelector<HTMLElement>('[tabindex]') || menuRef.current?.querySelector<HTMLElement>('button, a');
      setTimeout(() => first?.focus(), 0);
    } else if (render) {
      setClosing(true);
      const t = window.setTimeout(() => {
        setRender(false);
        setClosing(false);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [open, render]);

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('button, a, [role="menuitem"]') || []) as HTMLElement[];
    if (items.length === 0) return;

    const idx = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      prev?.focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div className="dropdown" ref={ref} onKeyDown={onKey}>
      {/* Conditionally apply styling based on isIconButton prop */}
      <button 
        ref={buttonRef} 
        type="button"
        className={isIconButton ? `header-icon-button ${open ? 'open' : ''}` : `btn btn-secondary dropdown-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen((s) => !s)} 
        aria-expanded={open} 
        aria-haspopup="menu"
      >
        {label}
        {!isIconButton && <span className="ms-2"></span> /* Add space for chevron if not icon button */}
      </button>
      {render && (
        <div className={`dropdown-menu ${open && !closing ? 'show' : ''} ${closing ? 'closing' : ''}`} ref={menuRef} role="menu">
          {children}
        </div>
      )}
    </div>
  );
}