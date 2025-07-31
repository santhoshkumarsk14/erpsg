import api from './api';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  notes?: string;
  termsAndConditions?: string;
  convertedFromQuoteId?: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceCreateRequest {
  clientId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  discountRate: number;
  notes?: string;
  termsAndConditions?: string;
  items: Omit<InvoiceItem, 'id' | 'invoiceId'>[];
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

export const getInvoices = () => api.get('/api/invoices');
export const createInvoice = (data: any) => api.post('/api/invoices', data);
export const updateInvoice = (id: number, data: any) => api.put(`/api/invoices/${id}`, data);
export const deleteInvoice = (id: number) => api.delete(`/api/invoices/${id}`);
export const downloadInvoiceExcel = (id: number) => api.get(`/api/invoices/${id}/excel`, { responseType: 'blob' });
export const downloadInvoicePdf = (id: number) => api.get(`/api/invoices/${id}/pdf`, { responseType: 'blob' });
export const getAuditTrail = (id: number) => api.get(`/api/invoices/${id}/audit-trail`);
export const getStatusHistory = (id: number) => api.get(`/api/invoices/${id}/status-history`);

export const sendInvoiceByEmail = async (id: number, emailData: { to: string; message?: string }) => {
  return api.post(`/api/invoices/${id}/send`, emailData);
};

const invoiceService = {
  // Get all invoices with optional filters
  getInvoices: async (filters?: {
    clientId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Invoice[]; totalElements: number; totalPages: number }> => {
    const response = await api.get('/api/invoices', { params: filters });
    return response.data;
  },
  
  // Get invoice by ID
  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/api/invoices/${id}`);
    return response.data;
  },
  
  // Create new invoice
  createInvoice: async (invoiceData: InvoiceCreateRequest): Promise<Invoice> => {
    const response = await api.post('/api/invoices', invoiceData);
    return response.data;
  },
  
  // Update invoice
  updateInvoice: async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.put(`/api/invoices/${id}`, invoiceData);
    return response.data;
  },
  
  // Delete invoice
  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/api/invoices/${id}`);
  },
  
  // Update invoice status
  updateInvoiceStatus: async (id: string, status: Invoice['status']): Promise<Invoice> => {
    const response = await api.put(`/api/invoices/${id}/status`, { status });
    return response.data;
  },
  
  // Export invoice to PDF
  exportInvoiceToPdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/api/invoices/${id}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    const response = await api.get('/api/clients');
    return response.data;
  },
  
  // Get client by ID
  getClient: async (id: string): Promise<Client> => {
    const response = await api.get(`/api/clients/${id}`);
    return response.data;
  },
  
  // Create new client
  createClient: async (clientData: Omit<Client, 'id' | 'companyId'>): Promise<Client> => {
    const response = await api.post('/api/clients', clientData);
    return response.data;
  },
  
  // Update client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    const response = await api.put(`/api/clients/${id}`, clientData);
    return response.data;
  },
  
  // Delete client
  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/api/clients/${id}`);
  },
};

export default invoiceService;