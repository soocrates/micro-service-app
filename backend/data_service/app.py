from fastapi import FastAPI, HTTPException, Query
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced user database with real profiles
users_db = [
    {
        "id": "1",
        "username": "sarah_tech",
        "name": "Sarah Johnson",
        "bio": "Senior Software Engineer | Python & React Expert",
        "avatar": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        "joined_date": "2024-01-15",
        "total_posts": 8,
        "followers": 245
    },
    {
        "id": "2",
        "username": "mark_developer",
        "name": "Mark Williams",
        "bio": "Full Stack Developer | Cloud Architecture Enthusiast",
        "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        "joined_date": "2024-01-20",
        "total_posts": 12,
        "followers": 189
    },
    {
        "id": "3",
        "username": "tech_emma",
        "name": "Emma Davis",
        "bio": "UX Designer & Frontend Developer | Design Systems Expert",
        "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        "joined_date": "2024-02-01",
        "total_posts": 6,
        "followers": 312
    }
]

# Enhanced analytics data
analytics_db = {
    "daily_visits": [
        {"date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"), 
         "count": random.randint(100, 500)} 
        for i in range(7)
    ],
    "user_activity": [
        {"user_id": "1", "actions": 42, "posts": 8, "comments": 16, "likes_received": 156},
        {"user_id": "2", "actions": 38, "posts": 12, "comments": 24, "likes_received": 198},
        {"user_id": "3", "actions": 35, "posts": 6, "comments": 18, "likes_received": 142}
    ],
    "popular_content": [
        {"id": "1", "title": "Building Scalable React Applications", "views": 342, "likes": 89},
        {"id": "2", "title": "Python Microservices Architecture", "views": 287, "likes": 76},
        {"id": "3", "title": "Modern UX Design Principles", "views": 256, "likes": 68},
        {"id": "4", "title": "Cloud Deployment Strategies", "views": 198, "likes": 45}
    ]
}

# Enhanced content database with real blog posts
content_db = [
    {
        "id": "1",
        "title": "Building Scalable React Applications",
        "content": """
React has become the go-to library for building modern web applications. In this comprehensive guide, 
I'll share my experience scaling React applications from small projects to enterprise-level solutions.

Key points we'll cover:
- Component architecture best practices
- State management strategies
- Performance optimization techniques
- Code splitting and lazy loading
- Testing strategies for large applications

Based on my experience leading frontend development at major tech companies, these practices have 
proven invaluable in maintaining large-scale React applications.
        """,
        "author_id": "1",
        "created_at": "2025-01-01T10:30:00",
        "category": "Frontend Development",
        "tags": ["react", "javascript", "web development", "performance"],
        "status": "published",
        "featured": True,
        "views": 342,
        "likes": 89,
        "comments": 24
    },
    {
        "id": "2",
        "title": "Python Microservices Architecture",
        "content": """
Microservices architecture has revolutionized how we build backend systems. This post explores 
implementing microservices using Python, FastAPI, and modern cloud technologies.

We'll explore:
- Service decomposition strategies
- Inter-service communication patterns
- API gateway implementation
- Monitoring and logging
- Deployment and scaling

Drawing from my experience building microservices at scale, I'll share practical insights and 
real-world examples.
        """,
        "author_id": "2",
        "created_at": "2025-01-02T14:15:00",
        "category": "Backend Development",
        "tags": ["python", "microservices", "fastapi", "architecture"],
        "status": "published",
        "featured": True,
        "views": 287,
        "likes": 76,
        "comments": 18
    },
    {
        "id": "3",
        "title": "Modern UX Design Principles",
        "content": """
Creating intuitive user experiences is crucial for modern applications. In this article, I'll share 
key UX design principles that have proven successful in my projects.

Topics covered:
- User-centered design approach
- Information architecture
- Interactive prototyping
- Usability testing methods
- Accessibility considerations

These insights come from years of experience designing user interfaces for various applications 
and platforms.
        """,
        "author_id": "3",
        "created_at": "2025-01-03T09:45:00",
        "category": "UX Design",
        "tags": ["ux", "design", "user experience", "accessibility"],
        "status": "published",
        "featured": False,
        "views": 256,
        "likes": 68,
        "comments": 15
    },
    {
        "id": "4",
        "title": "Cloud Deployment Strategies",
        "content": """
Effective cloud deployment is critical for modern applications. This guide covers essential 
strategies for deploying applications in the cloud.

We'll discuss:
- Container orchestration with Kubernetes
- CI/CD pipeline setup
- Multi-region deployment
- Cost optimization techniques
- Security best practices

Based on real-world experience deploying applications across different cloud providers.
        """,
        "author_id": "2",
        "created_at": "2025-01-04T16:20:00",
        "category": "DevOps",
        "tags": ["cloud", "deployment", "kubernetes", "devops"],
        "status": "published",
        "featured": True,
        "views": 198,
        "likes": 45,
        "comments": 12
    }
]

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
    category: Optional[str] = None
    tags: List[str] = []
    status: str = "published"
    featured: bool = False
    views: int = 0
    likes: int = 0
    comments: int = 0

class User(BaseModel):
    id: str
    username: str
    name: str
    bio: str
    avatar: str
    joined_date: str
    total_posts: int
    followers: int

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

@app.get("/users", response_model=List[User])
async def get_users():
    return users_db

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = next((user for user in users_db if user["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/content", response_model=List[ContentItem])
async def get_content(
    search: Optional[str] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    sort_by: Optional[str] = None,
    featured: Optional[bool] = None,
    status: Optional[str] = None
):
    filtered_content = content_db.copy()

    # Apply filters
    if search:
        search = search.lower()
        filtered_content = [
            item for item in filtered_content
            if search in item["title"].lower() or search in item["content"].lower()
        ]

    if category:
        filtered_content = [
            item for item in filtered_content
            if item["category"] == category
        ]

    if tag:
        filtered_content = [
            item for item in filtered_content
            if tag in item["tags"]
        ]

    if featured is not None:
        filtered_content = [
            item for item in filtered_content
            if item["featured"] == featured
        ]

    if status:
        filtered_content = [
            item for item in filtered_content
            if item["status"] == status
        ]

    # Apply sorting
    if sort_by:
        reverse = True if sort_by.startswith("-") else False
        key = sort_by.lstrip("-")
        filtered_content.sort(key=lambda x: x[key], reverse=reverse)

    return filtered_content

@app.get("/content/{content_id}", response_model=ContentItem)
async def get_content_item(content_id: str):
    for item in content_db:
        if item["id"] == content_id:
            # Increment views
            item["views"] += 1
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
    new_item["views"] = 0
    new_item["likes"] = 0
    new_item["comments"] = 0
    content_db.append(new_item)
    return new_item

@app.put("/content/{content_id}", response_model=ContentItem)
async def update_content(content_id: str, item: ContentItem):
    for i, existing_item in enumerate(content_db):
        if existing_item["id"] == content_id:
            updated_item = item.dict()
            updated_item["id"] = content_id
            updated_item["views"] = existing_item["views"]
            updated_item["likes"] = existing_item["likes"]
            updated_item["comments"] = existing_item["comments"]
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

@app.post("/content/{content_id}/like")
async def like_content(content_id: str):
    for item in content_db:
        if item["id"] == content_id:
            item["likes"] += 1
            return {"likes": item["likes"]}
    raise HTTPException(status_code=404, detail="Content not found")

@app.get("/content/categories")
async def get_categories():
    categories = set(item["category"] for item in content_db if item["category"])
    return list(categories)

@app.get("/content/tags")
async def get_tags():
    tags = set()
    for item in content_db:
        tags.update(item["tags"])
    return list(tags)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)