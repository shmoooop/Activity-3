import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import ApiClient from './utils/api';
import Modal from './components/Modal';
import Dropdown from './components/Dropdown';
import BookSearch from './pages/BookSearch'; 
import EditBook from './pages/EditBook'; 

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <div className="header-inner">
            <div className="title-placeholder"></div>

            <h1 className="app-title">
              <Link to="/" className="app-title-link" aria-label="Go to home">🕮 Digital Bookshelf</Link>
            </h1>
            
            <div className="title-actions">
              <Dropdown label="☰" isIconButton={true}>
                <Link className="dropdown-item" to="/">
                  <span className="dropdown-item-icon">🏠︎</span> Home
                </Link>
                <Link className="dropdown-item" to="/add">
                  <span className="dropdown-item-icon">✚</span> Add Book
                </Link>
                {/* 2. UPDATE "EDIT BOOK" LINK TO GO TO THE SEARCH PAGE */}
                <Link className="dropdown-item" to="/edit">
                  <span className="dropdown-item-icon">✎</span> Manage Books
                </Link>
                <a className="dropdown-item" onClick={() => { setModalOpen(true); }} style={{ cursor: 'pointer' }}>
                  <span className="dropdown-item-icon">✘</span> About
                </a>
              </Dropdown>
            </div>
          </div>
        </header>
      </div>

      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/add" element={<AddBook />} />
          
          {/* 3. THESE ARE THE UPDATED ROUTES */}
          <Route path="/edit" element={<BookSearch />} /> {/* /edit goes to search */}
          <Route path="/edit/:id" element={<EditBook />} /> {/* /edit/123 goes to the form */}
        </Routes>

        <footer className="mt-5">
          Digital Bookshelf • Backend: {ApiClient.defaults.baseURL}
        </footer>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="About this project">
        <p>This is a small React + TypeScript frontend for the Digital Bookshelf, built for learning.</p>
        <p>The code demonstrates routing, API interaction, and a modern, centered UI design.</p>
      </Modal>
    </>
  );
}