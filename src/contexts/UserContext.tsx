import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, fetchCurrentUser } from '../services/userService';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { access_token } = await loginUser(username, password);
      localStorage.setItem('token', access_token);
      const userData = await fetchCurrentUser(access_token);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};