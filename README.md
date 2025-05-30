# Microservices Demo Application

A demonstration of a modern microservices architecture with a beautiful React frontend and Python backend services.

## Architecture

This application consists of:

1. **User Service** - Python FastAPI service handling user authentication and management
2. **Data Service** - Python FastAPI service handling content and analytics
3. **Frontend** - React application with Typescript and Tailwind CSS

## Running Locally

### Prerequisites

- Docker and Docker Compose
- Node.js (for frontend development outside Docker)
- Python 3.11+ (for backend development outside Docker)

### Using Docker Compose

The easiest way to run the entire application stack is using Docker Compose:

```bash
docker-compose up
```

This will start all three services:
- User Service: http://localhost:8000
- Data Service: http://localhost:8001
- Frontend: http://localhost:5173

### Running Services Individually

#### User Service

```bash
cd backend/user_service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

#### Data Service

```bash
cd backend/data_service
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

#### Frontend

```bash
npm install
npm run dev
```

## API Documentation

### User Service

- `GET /users` - Get all users
- `GET /users/{user_id}` - Get user by ID
- `POST /users` - Create a new user
- `POST /login` - Login a user
- `GET /me` - Get current user info

### Data Service

- `GET /analytics` - Get analytics data
- `GET /content` - Get all content
- `GET /content/{content_id}` - Get content by ID
- `GET /content/author/{author_id}` - Get content by author
- `POST /content` - Create new content

## Features

- User authentication
- Content management
- Analytics visualization
- Responsive design

## Demo Credentials

- **Username:** johndoe
- **Password:** password (any password works in this demo)