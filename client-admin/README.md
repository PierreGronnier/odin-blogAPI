# Admin Panel - Blog API

Admin interface for managing blog posts and moderating comments.

## Features

- **Dashboard**: Overview of posts and comments statistics
- **Post Management**: Create, edit, publish/unpublish, and delete posts
- **Rich Text Editor**: TinyMCE integration with preview mode
- **Comment Moderation**: Approve, reject, or delete user comments
- **Authentication**: Secure admin-only access with JWT tokens

## Tech Stack

- React 19
- React Router DOM
- Vite
- TinyMCE React
- SweetAlert2

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Running backend server (see `/server` directory)
- TinyMCE API key

## Installation

```bash
cd client-admin
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

## Development

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Default Admin Account

To access the admin panel, you need an account with `ADMIN` role. Create one directly in your database or through the backend.

## Project Structure

```
client-admin/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # Reusable components
│   ├── layout/       # Layout components (Navbar, Footer)
│   ├── pages/        # Page components
│   ├── styles/       # CSS files
│   └── utils/        # Utility functions
└── public/           # Static assets
```

## Key Features

### Post Management

- Create and edit posts with rich text formatting
- Publish/unpublish posts
- Preview content before publishing
- Delete posts with confirmation

### Comment Moderation

- View all comments organized by post
- Approve or reject comments
- Permanently delete spam or inappropriate comments
- Expand/collapse post sections

### Dashboard

- Real-time statistics
- Quick access to main features
- Recent activity overview
