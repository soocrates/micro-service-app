from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import time
import random
from datetime import datetime, timedelta

app = FastAPI(title="Data Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory database for demo
analytics_db = {
    "daily_visits": [
        {"date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"), 
         "count": random.randint(100, 500)} 
        for i in range(7)
    ],
    "user_activity": [
        {"user_id": "1", "actions": random.randint(10, 50)},
        {"user_id": "2", "actions": random.randint(10, 50)},
        {"user_id": "3", "actions": random.randint(10, 50)}
    ],
    "popular_content": [
        {"id": "1", "title": "Getting Started Guide", "views": random.randint(50, 200)},
        {"id": "2", "title": "Advanced Techniques", "views": random.randint(50, 200)},
        {"id": "3", "title": "Troubleshooting", "views": random.randint(50, 200)},
        {"id": "4", "title": "API Documentation", "views": random.randint(50, 200)}
    ]
}

# Models
class AnalyticsResponse(BaseModel):
    daily_visits: List[Dict[str, Any]]
    user_activity: List[Dict[str, Any]]
    popular_content: List[Dict[str, Any]]

class ContentItem(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    author_id: str
    created_at: str

# Content database
content_db = [
    {
        "id": "1", 
        "title": "Getting Started Guide", 
        "content": "This is a comprehensive guide to get you started with our platform.",
        "author_id": "1",
        "created_at": "2025-01-01T00:00:00"
    },
    {
        "id": "2", 
        "title": "Advanced Techniques", 
        "content": "Learn advanced techniques to maximize your productivity.",
        "author_id": "2",
        "created_at": "2025-01-02T00:00:00"
    },
    {
        "id": "3", 
        "title": "Troubleshooting", 
        "content": "Common issues and how to solve them quickly.",
        "author_id": "1",
        "created_at": "2025-01-03T00:00:00"
    },
    {
        "id": "4", 
        "title": "API Documentation", 
        "content": "Complete API reference with examples.",
        "author_id": "3",
        "created_at": "2025-01-04T00:00:00"
    }
]

# Routes
@app.get("/")
async def root():
    return {"message": "Data Service API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "data-service", "timestamp": time.time()}

@app.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    return analytics_db

@app.get("/content", response_model=List[ContentItem])
async def get_content():
    return content_db

@app.get("/content/{content_id}", response_model=ContentItem)
async def get_content_item(content_id: str):
    for item in content_db:
        if item["id"] == content_id:
            return item
    raise HTTPException(status_code=404, detail="Content not found")

@app.get("/content/author/{author_id}", response_model=List[ContentItem])
async def get_author_content(author_id: str):
    results = [item for item in content_db if item["author_id"] == author_id]
    return results

@app.post("/content", response_model=ContentItem)
async def create_content(item: ContentItem):
    new_item = item.dict()
    new_item["id"] = str(len(content_db) + 1)
    content_db.append(new_item)
    return new_item

@app.put("/content/{content_id}", response_model=ContentItem)
async def update_content(content_id: str, item: ContentItem):
    for i, existing_item in enumerate(content_db):
        if existing_item["id"] == content_id:
            updated_item = item.dict()
            updated_item["id"] = content_id
            content_db[i] = updated_item
            return updated_item
    raise HTTPException(status_code=404, detail="Content not found")

@app.delete("/content/{content_id}")
async def delete_content(content_id: str):
    for i, item in enumerate(content_db):
        if item["id"] == content_id:
            del content_db[i]
            return {"message": "Content deleted successfully"}
    raise HTTPException(status_code=404, detail="Content not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)