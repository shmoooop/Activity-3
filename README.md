Digital Bookshelf + API

A full-stack web application for managing a digital collection of books, authors, and categories. Built with React for the frontend and NestJS for the backend, designed with beginner-friendly code.

Features ✨

View Books: Browse your entire book collection in a clean, paginated, responsive grid.

Add Books: Add new books with title, author, category, year, and description. Authors and categories are automatically created if they don't exist.

Manage Books: Search for existing books to edit or delete them.

Edit Books: Update the details of existing books.

Delete Books: Remove books from your collection.

Responsive Design: Works on desktop and mobile devices.

API Documentation: Interactive API documentation via Swagger.

Data Persistence: Uses a local SQLite database file that persists across server restarts.

Tech Stack 🛠️

Frontend:

React (v18) with TypeScript

React Router (v6)

Axios (for API calls)

Custom CSS (main.css)

cross-env (for cross-platform port setting)

Backend:

NestJS (v9) with TypeScript

TypeORM (v0.3)

SQLite (sqlite3 driver)

Swagger (for API docs)

Class Validator & Class Transformer (for input validation)

Development:

Node.js (v18+ recommended)

npm

VS Code

Prerequisites 📋

Node.js: (v18 or later recommended) - Download from nodejs.org

npm: (Usually comes with Node.js)

Setup and Installation ⚙️

Clone the repository:

git clone <your-repository-url>
cd <your-repository-folder>


Install Backend Dependencies:

cd backend
npm install


Install Frontend Dependencies:

cd ../frontend
npm install


Running the Application ▶️

You need to run both the backend and frontend servers simultaneously in separate terminals.

Start the Backend Server:

Open a terminal in the backend folder.

Run the development server:

npm run start:dev


The backend will be running at http://localhost:3000.

API documentation (Swagger) will be available at http://localhost:3000/api.

The SQLite database file (digital_bookshelf.sqlite) will be created in the backend root folder.

Start the Frontend Server:

Open a second terminal in the frontend folder.

Run the development server:

npm start


The frontend application will automatically open in your browser at http://localhost:3001.

Now you can use the Digital Bookshelf application in your browser!

Project Structure 📁

.
├── backend/        # NestJS API
│   ├── dist/       # Compiled JavaScript code (ignored by watcher)
│   ├── node_modules/
│   ├── src/
│   │   ├── authors/    # Author CRUD module
│   │   ├── books/      # Book CRUD module (Controller, Service, Module, Entity, DTOs)
│   │   ├── categories/ # Category CRUD module
│   │   ├── app.controller.ts
│   │   ├── app.module.ts # Configures DB connection and imports other modules
│   │   └── main.ts     # Starts the app, enables CORS, validation, Swagger
│   ├── digital_bookshelf.sqlite # SQLite database file (ignored by watcher)
│   ├── nest-cli.json   # Configures watcher to ignore DB file
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/       # React UI
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/ # Reusable UI (Bookcard, Modal, Dropdown, Skeleton, etc.)
    │   ├── pages/      # Page components (Home, AddBook, EditBook, BookSearch, BookDetail)
    │   ├── utils/      # API client (api.ts), data normalization (normalize.ts)
    │   ├── App.tsx     # Main routing and layout
    │   ├── index.tsx   # React entry point
    │   └── main.css    # All application styles
    ├── package.json    # Configures start script (port 3001) and proxy (to port 3000)
    └── tsconfig.json

