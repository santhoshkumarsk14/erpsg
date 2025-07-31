import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  department?: string;
  position?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields used in the app
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  twoFaEnabled?: boolean;
  jobTitle?: string;
  bio?: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
}

const userService = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  
  // Get all users in company
  getCompanyUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/users/company');
    return response.data;
  },
  
  // Create new user
  createUser: async (userData: UserCreateRequest): Promise<User> => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },
  
  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },
  
  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },
  
  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/api/users/change-password', { oldPassword, newPassword });
  },
};

export default userService;