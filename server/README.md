# Blog API - Server

RESTful API backend for blog platform with authentication, post management, and comment moderation.

## Tech Stack

- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs (password hashing)
- express-validator (input validation)
- sanitize-html (XSS protection)

## Prerequisites

- Node.js (v16+)
- PostgreSQL database
- npm or yarn

## Installation

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/blogdb
JWT_SECRET=your_secret_key_here
PORT=3001
```

## Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to manage data (you can change role here if you want)
npx prisma studio
```

## Development

```bash
# Start with auto-reload
node --watch src/server.js

# Or without watch mode
node src/server.js
```

The API will be available at `http://localhost:3001/api`

## Creating Admin User

Register a user through `/api/auth/register`, then update their role in the database:

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

## Security Features

- JWT-based authentication with token invalidation
- Role-based access control (USER, ADMIN)
- Password hashing with bcryptjs
- HTML sanitization (different levels for posts/comments)
- Input validation with express-validator
- CORS configuration

## API Endpoints Documentation

### Authentication (/api/auth)

- POST /register : Create a new user account
- POST /login : User login
- POST /logout : User logout (Authenticated)

### Users (/api/users)

- POST / : Create a user
- GET /me : Get current user profile (Authenticated)
- GET / : Get all users (Admin only)

### Posts (/api/posts)

- GET / : Get all published posts (Public)
- GET /:id : Get a specific published post (Public)
- POST / : Create a new post (Admin only)
- PUT /:id : Update own post (Authenticated + Owner only)
- DELETE /:id : Delete own post (Authenticated + Owner only)

### Posts Administration (/api/posts)

- GET /admin/list : Get all posts including drafts (Admin only)
- GET /admin/:id : Get any post by ID (Admin only)
- PUT /:id/admin : Update any post (Admin only)
- DELETE /:id/admin : Delete any post (Admin only)
- PUT /:id/publish : Set post to published status (Admin only)
- PUT /:id/unpublish : Set post to draft status (Admin only)

### Comments (/api/comments)

- GET /?postId=ID : Get comments for a specific post
- GET /:id : Get a specific comment
- POST / : Add a comment (Public or Authenticated)
- PUT /:id : Update own comment (Owner only - Registered users only)
- DELETE /:id : Delete own comment (Owner only - Registered users only)

### Comments Administration (/api/comments)

- GET /admin/all : Get all comments from the database (Admin only)
- PUT /:id/admin/approve : Approve a comment (Admin only)
- PUT /:id/admin/reject : Reject a comment (Admin only)
- DELETE /:id/admin : Permanently delete any comment (Admin only)
