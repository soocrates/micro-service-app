import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { fetchContentItem, fetchUser } from '../services/dataService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Clock, User } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
}

interface Author {
  id: string;
  username: string;
  name: string;
}

const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadContent = async () => {
      if (!id) return;
      
      try {
        const contentData = await fetchContentItem(id);
        setContent(contentData);
        
        // In a real app, we'd fetch the author info from the user service
        // For this demo, we'll simulate it
        setAuthor({
          id: contentData.author_id,
          username: `user${contentData.author_id}`,
          name: `User ${contentData.author_id}`
        });
      } catch (error) {
        console.error('Error fetching content details:', error);
        toast.error('Failed to load content details');
        navigate('/content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800">Content not found</h2>
        <Link 
          to="/content"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to content
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          to="/content"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900">{content.title}</h1>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>By {author?.name || `Author ${content.author_id}`}</span>
            <span className="mx-2">•</span>
            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <time dateTime={content.created_at}>
              {new Date(content.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed">{content.content}</p>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => toast.success('Content saved to favorites!')}
            >
              Save
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => toast.success('Comment feature coming soon!')}
            >
              Comment
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => toast.success('Content shared!')}
            >
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Related Content</h2>
          <p className="mt-1 text-sm text-gray-500">Other content you might be interested in.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center text-sm text-gray-500">
              <p>Related content will be displayed here in a future update.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;