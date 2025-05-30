import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { fetchContent, createContent, deleteContent, updateContent } from '../services/dataService';
import { toast } from 'react-hot-toast';
import { Clock, User, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadContent();
  }, [isAuthenticated, navigate]);

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

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await updateContent({
          ...editingContent,
          ...formData,
        });
        toast.success('Content updated successfully');
      } else {
        await createContent({
          ...formData,
          author_id: user?.id || '1',
          created_at: new Date().toISOString(),
        });
        toast.success('Content created successfully');
      }
      setIsModalOpen(false);
      setEditingContent(null);
      setFormData({ title: '', content: '' });
      loadContent();
    } catch (error) {
      toast.error(editingContent ? 'Failed to update content' : 'Failed to create content');
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      content: item.content,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
        toast.success('Content deleted successfully');
        loadContent();
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

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
          onClick={() => {
            setEditingContent(null);
            setFormData({ title: '', content: '' });
            setIsModalOpen(true);
          }}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {content.map((item) => (
            <li key={item.id} className="relative">
              <Link to={`/content/${item.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{item.title}</p>
                    </div>
                    <div className="ml-2 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(item);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-blue-500 focus:outline-none"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(item.id);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingContent ? 'Edit Content' : 'Create New Content'}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingContent(null);
                    setFormData({ title: '', content: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingContent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;