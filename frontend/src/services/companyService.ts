import api from './api';

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  registrationNumber?: string;
  taxId?: string;
  plan: 'Basic' | 'Professional' | 'Pro';
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyCreateRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  registrationNumber?: string;
  taxId?: string;
  plan: 'Basic' | 'Professional' | 'Pro';
  adminUsername: string;
  adminPassword: string;
  adminEmail: string;
  adminName: string;
}

const companyService = {
  // Get company by ID
  getCompany: async (id: string): Promise<Company> => {
    const response = await api.get(`/api/companies/${id}`);
    return response.data;
  },
  
  // Get current user's company
  getCurrentCompany: async (): Promise<Company> => {
    const response = await api.get('/api/companies/current');
    return response.data;
  },
  
  // Create new company (admin only)
  createCompany: async (companyData: CompanyCreateRequest): Promise<Company> => {
    const response = await api.post('/api/companies', companyData);
    return response.data;
  },
  
  // Update company
  updateCompany: async (id: string, companyData: Partial<Company>): Promise<Company> => {
    const response = await api.put(`/api/companies/${id}`, companyData);
    return response.data;
  },
  
  // Get all companies (admin only)
  getAllCompanies: async (): Promise<Company[]> => {
    const response = await api.get('/api/companies');
    return response.data;
  },

  // Onboard company
  onboardCompany: async (onboardingData: any): Promise<Company> => {
    const response = await api.post('/api/company/onboard', onboardingData);
    return response.data;
  },
};

export default companyService;