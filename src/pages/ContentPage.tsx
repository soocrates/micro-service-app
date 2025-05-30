import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { fetchContent } from '../services/dataService';
import { toast } from 'react-hot-toast';
import { Clock, Eye, User, ChevronRight } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
}

const ContentPage: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadContent = async () => {
      try {
        const data = await fetchContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
        <button
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => toast.success('Create content feature coming soon!')}
        >
          New Content
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {content.map((item) => (
            <li key={item.id}>
              <Link to={`/content/${item.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{item.title}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Author ID: {item.author_id}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Created on{' '}
                        <time dateTime={item.created_at}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </time>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentPage;