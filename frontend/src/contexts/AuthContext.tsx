import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  companyId: string;
  department?: string;
  position?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  twoFaEnabled?: boolean;
  jobTitle?: string;
  bio?: string;
}

interface Company {
  id: string;
  name: string;
  plan: 'Basic' | 'Professional' | 'Pro';
  employeeCount: number;
  createdAt: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string, jwt?: string) => Promise<void>;
  register: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName: string;
    industry: string;
    employeeCount: string;
  }) => Promise<void>;
  logout: () => void;
  hasAccess: (feature: string) => boolean;
  updateCompanySettings: (companyData: Partial<Company>) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const userResponse = await axios.get('/api/users/me');
          setUser(userResponse.data);
          
          // Get company data
          const companyResponse = await axios.get(`/api/companies/${userResponse.data.companyId}`);
          setCompany(companyResponse.data);
          
          setError(null);
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          setUser(null);
          setCompany(null);
          setError('Session expired. Please login again.');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { username, password });
      const { token, user: userData } = response.data;
      
      // Save token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user
      setUser(userData);
      
      // Get company data
      const companyResponse = await axios.get(`/api/companies/${userData.companyId}`);
      setCompany(companyResponse.data);
      
      setError(null);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCompany(null);
  };

  // Feature access control based on company plan
  const hasAccess = (feature: string): boolean => {
    if (!company) return false;
    
    // Define features available for each plan
    const planFeatures: Record<string, string[]> = {
      'Basic': [
        'hr', 
        'invoice', 
        'basic_reporting'
      ],
      'Professional': [
        'hr', 
        'payroll', 
        'invoice', 
        'timesheet', 
        'tools', 
        'procurement', 
        'advanced_analytics'
      ],
      'Pro': [
        'hr', 
        'payroll', 
        'invoice', 
        'timesheet', 
        'tools', 
        'procurement', 
        'advanced_analytics', 
        'custom_integrations', 
        'advanced_security'
      ]
    };
    
    return planFeatures[company.plan]?.includes(feature) || false;
  };

  const updateCompanySettings = async (companyData: Partial<Company>) => {
    if (!company || !user) {
      setError('You must be logged in to update company settings');
      return;
    }
    
    try {
      setLoading(true);
      // In a real application, this would call an API
      // const response = await axios.put(`/api/companies/${company.id}`, companyData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update company state with new data
      setCompany(prev => prev ? { ...prev, ...companyData } : null);
      setError(null);
    } catch (err: any) {
      console.error('Update company settings failed:', err);
      setError(err.response?.data?.message || 'Failed to update company settings.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName: string;
    industry: string;
    employeeCount: string;
  }) => {
    try {
      setLoading(true);
      
      // Create the registration request payload
      const registrationData = {
        username: formData.email, // Using email as username
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        password: formData.password,
        role: 'admin', // First user is always admin
        company: {
          name: formData.companyName,
          industry: formData.industry,
          employeeCount: formData.employeeCount,
          plan: 'Basic' // Default plan for new registrations
        }
      };
      
      // Make the API call to register
      const response = await axios.post('/api/auth/register', registrationData);
      const { token, user: userData, company: companyData } = response.data;
      
      // Save token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user and company data
      setUser(userData);
      setCompany(companyData);
      setError(null);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err; // Re-throw to allow the component to handle it
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: any) => {
    // Implement actual profile update logic here
    return Promise.resolve();
  };
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    // Implement actual password update logic here
    return Promise.resolve();
  };

  const value = {
    user,
    company,
    loading,
    error,
    login,
    logout,
    register,
    hasAccess,
    updateCompanySettings,
    updateUserProfile,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};