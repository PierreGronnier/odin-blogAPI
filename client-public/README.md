# Blog - Public Client

Public-facing blog interface for reading posts and engaging with comments.

## Features

- **Browse Posts**: View all published blog posts
- **Read Articles**: Full post view with rich content rendering
- **Comment System**: Add, edit, and delete comments
- **User Authentication**: Optional login for comment management

## Tech Stack

- React 19
- React Router DOM
- Create React App
- SweetAlert2

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Running backend server (see `/server` directory)

## Installation

```bash
cd client-public
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Development

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
client-public/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # Reusable components
│   ├── layout/       # Layout components (Navbar, Footer)
│   ├── pages/        # Page components
│   ├── routes/       # React Router configuration
│   └── styles/       # CSS files
└── public/           # Static assets
```

## Features

### Post Browsing

- Clean, card-based post listing
- Post excerpts with metadata (author, date)
- Click to read full article

### Post Reading

- Rich content rendering (HTML from TinyMCE)
- Images, code blocks, tables support
- Responsive layout

### Comment System

- **Anonymous Comments**: Post without login
- **Registered Comments**: Login to edit/delete your comments
- **Real-time Updates**: See new comments immediately
- **Edit Mode**: Inline editing for your own comments

### Authentication

- User registration
- Login/logout
- Optional authentication for commenting
- Profile management

## User Flows

### Anonymous User

1. Browse and read posts
2. Add comments (cannot edit/delete later)

### Registered User

1. Register/Login
2. Browse and read posts
3. Add comments
4. Edit or delete own comments
5. Persistent username across sessions
