import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import ContentDetailPage from './pages/ContentDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="content/:id" element={<ContentDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;