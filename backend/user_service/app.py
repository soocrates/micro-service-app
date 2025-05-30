from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import time
from datetime import datetime, timedelta

app = FastAPI(title="User Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory database for demo
users_db = [
    {"id": "1", "username": "johndoe", "email": "john@example.com", "name": "John Doe", "created_at": "2025-01-01T00:00:00"},
    {"id": "2", "username": "janedoe", "email": "jane@example.com", "name": "Jane Doe", "created_at": "2025-01-02T00:00:00"},
    {"id": "3", "username": "bobsmith", "email": "bob@example.com", "name": "Bob Smith", "created_at": "2025-01-03T00:00:00"},
]

# Auth tokens (in-memory for demo only)
tokens_db = {}

# Models
class User(BaseModel):
    id: str
    username: str
    email: str
    name: str
    created_at: str

class UserCreate(BaseModel):
    username: str
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserInDB(User):
    password: str

# Auth helper functions
def get_current_user(token: str):
    if token not in tokens_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return tokens_db[token]

# Routes
@app.get("/")
async def root():
    return {"message": "User Service API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "user-service", "timestamp": time.time()}

@app.get("/users", response_model=List[User])
async def get_users():
    return users_db

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    for user in users_db:
        if user["id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/users", response_model=User)
async def create_user(user: UserCreate):
    # Check if username already exists
    for existing_user in users_db:
        if existing_user["username"] == user.username:
            raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create new user
    new_user = {
        "id": str(len(users_db) + 1),
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "created_at": datetime.now().isoformat()
    }
    users_db.append(new_user)
    return new_user

@app.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    # Simplified login for demo purposes
    for user in users_db:
        if user["username"] == user_data.username:
            # In a real app, we'd verify the password here
            token = str(uuid.uuid4())
            tokens_db[token] = user
            return {"access_token": token}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
    )

@app.get("/me", response_model=User)
async def read_users_me(token: str):
    return get_current_user(token)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)