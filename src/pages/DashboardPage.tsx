import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { fetchAnalytics } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Analytics {
  daily_visits: Array<{ date: string; count: number }>;
  user_activity: Array<{ user_id: string; actions: number }>;
  popular_content: Array<{ id: string; title: string; views: number }>;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800">Unable to load analytics data</h2>
        <p className="mt-2 text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700 sm:mt-0">
          Welcome back, <span className="font-semibold">{user?.name}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Daily Visits</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.daily_visits.reduce((sum, day) => sum + day.count, 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.user_activity.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Content Items</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.popular_content.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {analytics.popular_content.reduce((sum, item) => sum + item.views, 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Visits</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.daily_visits}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Content</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.popular_content}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">User Activity</h2>
          <p className="mt-1 text-sm text-gray-500">Recent actions by users in the system.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {analytics.user_activity.map((item) => (
              <li key={item.user_id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center text-white font-bold">
                        {item.user_id}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">User {item.user_id}</div>
                      <div className="text-sm text-gray-500">
                        {item.actions} actions
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;