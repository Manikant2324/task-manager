# Task Manager

## Overview
This project is a task management application built with React (frontend) and Node.js + Express (backend), using MongoDB for storage.

## Features
- User registration and login with JWT authentication
- Role-based authorization (`admin` / `member`)
- CRUD operations for tasks
- Task assignment and file uploads (PDF documents)
- Filtering and sorting tasks by status, priority, and due date
- Admin user management via REST API
- Docker and Docker Compose support

## Local Setup
### Backend
1. Navigate to `server`
2. Install dependencies: `npm install`
3. Start server: `npm run dev`

### Frontend
1. Navigate to `client`
2. Install dependencies: `npm install`
3. Start client: `npm run dev`

## Docker Setup
From the project root:

```bash
docker-compose up --build
```

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users` (admin only)
- `POST /api/users` (admin only)
- `PUT /api/users/:id` (admin only)
- `DELETE /api/users/:id` (admin only)
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

- ## Live Demo

Frontend:
https://task-manager-frontend-henna-pi.vercel.app/

Backend API:
https://task-manager-ls4e.onrender.com

## Notes
- The backend uses `uploads/` for PDF storage and serves files at `/uploads/*`.
- The client reads API base URL from `VITE_API_URL`.
