import { API_USER_SERVICE } from '../config/api';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  created_at: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserCreateData {
  username: string;
  email: string;
  name: string;
  password: string;
}

// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_USER_SERVICE}/users`);
  if (!response.ok) {
    throw new Error(`Error fetching users: ${response.statusText}`);
  }
  return response.json();
};

// Get user by ID
export const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_USER_SERVICE}/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Error fetching user: ${response.statusText}`);
  }
  return response.json();
};

// Login user
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_USER_SERVICE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  
  return response.json();
};

// Get current user
export const fetchCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_USER_SERVICE}/me?token=${token}`);
  if (!response.ok) {
    throw new Error(`Error fetching current user: ${response.statusText}`);
  }
  return response.json();
};

// Create new user
export const createUser = async (userData: UserCreateData): Promise<User> => {
  const response = await fetch(`${API_USER_SERVICE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create user');
  }
  
  return response.json();
};