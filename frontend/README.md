Digital Bookshelf - Frontend

This is a beginner-friendly React frontend for the Digital Bookshelf project.

Quick start (PowerShell):

1. cd frontend
2. npm install
3. npm start

The frontend expects the backend API at http://localhost:3000 (Swagger at /api). If your backend runs on a different host/port, update `src/utils/api.ts`.

Pages
-----

This frontend exposes the following pages (located in `src/pages`):

- Home Page (`Home.tsx`) — search and quick results / welcome state.
- View Book Page (`ViewBook.tsx`) — list/grid of all books; this component also shows a single-book detail when routed to `/books/:id` (the former separate `BookDetail.tsx` has been merged into this page).
- Add Book Page (`AddBook.tsx`) — form to create a new book.
- Edit Book Page (`EditBook.tsx`) — form to edit an existing book (`/edit/:id`).

Note: `BookDetail.tsx` was removed and its behavior is available when visiting `/books/:id` handled by `ViewBook.tsx`.

Running
-------

Same quick-start as above:

1. cd frontend
2. npm install
3. npm start

If you need help rewriting git history to remove the deleted file completely from past commits, see the instructions below.

History-cleanup (optional)
--------------------------

If you have a git repository and want to remove `src/pages/BookDetail.tsx` from history (dangerous: rewrites commits), you can run one of the following locally. Make sure to coordinate with teammates and back up the repo.

Recommended (git-filter-repo, faster and safer than filter-branch):

```powershell
# install if needed (one-time)
pip install git-filter-repo

# from repo root
git clone --mirror <your-repo-url> repo-mirror.git; cd repo-mirror.git
git filter-repo --path src/pages/BookDetail.tsx --invert-paths
git push --force
```

Alternative (git filter-branch — older, slower):

```powershell
git clone <your-repo-url> repo-clean
cd repo-clean
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch src/pages/BookDetail.tsx" --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
git push origin --force --tags
```

Warning: both approaches rewrite history. Only perform this when you're ready to force-push and when collaborators agree.

