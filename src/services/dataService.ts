import { API_DATA_SERVICE } from '../config/api';

// Types
interface ContentItem {
  id?: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  category?: string;
  tags: string[];
  status: string;
  featured: boolean;
  views: number;
  likes: number;
}

interface Analytics {
  daily_visits: Array<{ date: string; count: number }>;
  user_activity: Array<{ user_id: string; actions: number }>;
  popular_content: Array<{ id: string; title: string; views: number }>;
}

interface ContentFilters {
  search?: string;
  category?: string;
  tag?: string;
  sort_by?: string;
  featured?: boolean;
  status?: string;
}

// Get analytics data
export const fetchAnalytics = async (): Promise<Analytics> => {
  const response = await fetch(`${API_DATA_SERVICE}/analytics`);
  if (!response.ok) {
    throw new Error(`Error fetching analytics: ${response.statusText}`);
  }
  return response.json();
};

// Get all content with filters
export const fetchContent = async (filters?: ContentFilters): Promise<ContentItem[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`${API_DATA_SERVICE}/content?${params.toString()}`);
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
export const createContent = async (contentData: Omit<ContentItem, 'id' | 'views' | 'likes'>): Promise<ContentItem> => {
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

// Update content
export const updateContent = async (contentData: ContentItem): Promise<ContentItem> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/${contentData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update content');
  }
  
  return response.json();
};

// Delete content
export const deleteContent = async (contentId: string): Promise<void> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/${contentId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete content');
  }
};

// Like content
export const likeContent = async (contentId: string): Promise<{ likes: number }> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/${contentId}/like`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to like content');
  }
  
  return response.json();
};

// Get categories
export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/categories`);
  if (!response.ok) {
    throw new Error(`Error fetching categories: ${response.statusText}`);
  }
  return response.json();
};

// Get tags
export const fetchTags = async (): Promise<string[]> => {
  const response = await fetch(`${API_DATA_SERVICE}/content/tags`);
  if (!response.ok) {
    throw new Error(`Error fetching tags: ${response.statusText}`);
  }
  return response.json();
};