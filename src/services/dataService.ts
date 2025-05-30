import { API_DATA_SERVICE } from '../config/api';

// Types
interface ContentItem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
}

interface Analytics {
  daily_visits: Array<{ date: string; count: number }>;
  user_activity: Array<{ user_id: string; actions: number }>;
  popular_content: Array<{ id: string; title: string; views: number }>;
}

// Get analytics data
export const fetchAnalytics = async (): Promise<Analytics> => {
  const response = await fetch(`${API_DATA_SERVICE}/analytics`);
  if (!response.ok) {
    throw new Error(`Error fetching analytics: ${response.statusText}`);
  }
  return response.json();
};

// Get all content
export const fetchContent = async (): Promise<ContentItem[]> => {
  const response = await fetch(`${API_DATA_SERVICE}/content`);
  if (!response.ok) {
    throw new Error(`Error fetching content: ${response.statusText}`);
  }
  return response.json();
};

// Get content by ID
export const fetchContentItem = async (contentId: string): Promise<ContentItem> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/${contentId}`);
  if (!response.ok) {
    throw new Error(`Error fetching content item: ${response.statusText}`);
  }
  return response.json();
};

// Get content by author
export const fetchAuthorContent = async (authorId: string): Promise<ContentItem[]> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/author/${authorId}`);
  if (!response.ok) {
    throw new Error(`Error fetching author content: ${response.statusText}`);
  }
  return response.json();
};

// Create new content
export const createContent = async (contentData: ContentItem): Promise<ContentItem> => {
  const response = await fetch(`${API_DATA_SERVICE}/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create content');
  }
  
  return response.json();
};