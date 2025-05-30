from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Content(Base):
    __tablename__ = "content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    author_id = Column(Integer, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, index=True)
    visit_count = Column(Integer, default=0)
    content_id = Column(Integer, ForeignKey("content.id"), nullable=True)
    user_id = Column(Integer, nullable=True)
    action_type = Column(String)  # e.g., 'visit', 'content_view', 'user_action'