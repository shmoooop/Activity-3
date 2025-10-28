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
