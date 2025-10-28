# Digital Bookshelf 📚

A full-stack web application for managing a digital collection of books, authors, and categories. Built with React for the frontend and NestJS for the backend.

## Features ✨

* **View Books:** Browse your entire book collection in a clean, paginated grid.
* **Add Books:** Add new books with title, author, category, year, and description.
* **Manage Books:** Search for existing books to edit or delete them.
* **Edit Books:** Update the details of existing books.
* **Delete Books:** Remove books from your collection.
* **Responsive Design:** Works on desktop and mobile devices.
* **API Documentation:** Interactive API documentation via Swagger.

---

## Tech Stack 🛠️

* **Frontend:**
    * React
    * TypeScript
    * React Router
    * Axios
    * CSS (Custom)
* **Backend:**
    * NestJS
    * TypeScript
    * TypeORM
    * SQLite
    * Swagger (for API docs)
    * Class Validator & Class Transformer (for input validation)

---

## Prerequisites 📋

* **Node.js:** (v18 or later recommended) - Download from [nodejs.org](https://nodejs.org/)
* **npm:** (Usually comes with Node.js)

---

## Setup and Installation ⚙️

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-folder>
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

---

## Running the Application ▶️

You need to run both the backend and frontend servers simultaneously in separate terminals.

1.  **Start the Backend Server:**
    * Open a terminal in the `backend` folder.
    * Run the development server:
        ```bash
        npm run start:dev
        ```
    * The backend will be running at `http://localhost:3000`.
    * API documentation (Swagger) will be available at `http://localhost:3000/api`.

2.  **Start the Frontend Server:**
    * Open a *second* terminal in the `frontend` folder.
    * Run the development server:
        ```bash
        npm start
        ```
    * The frontend application will automatically open in your browser at `http://localhost:3001`.

Now you can use the Digital Bookshelf application in your browser!

---

## Project Structure 📁
