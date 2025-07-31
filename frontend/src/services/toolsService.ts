import api from './api';

// Tools
export const getTools = () => api.get('/api/tools');
export const createTool = (data: any) => api.post('/api/tools', data);
export const updateTool = (id: number, data: any) => api.put(`/api/tools/${id}`, data);
export const deleteTool = (id: number) => api.delete(`/api/tools/${id}`);
export const downloadToolExcel = (id: number) => api.get(`/api/tools/${id}/excel`, { responseType: 'blob' });

// Tool Transactions
export const getToolTransactions = () => api.get('/api/tool-transactions');
export const getTransactionsByTool = (toolId: number) => api.get(`/api/tool-transactions/tool/${toolId}`);
export const checkOutTool = (toolId: number, userId: number, remarks?: string) => api.post(`/api/tool-transactions/checkout?toolId=${toolId}&userId=${userId}${remarks ? `&remarks=${encodeURIComponent(remarks)}` : ''}`);
export const checkInTool = (toolId: number, userId: number, remarks?: string) => api.post(`/api/tool-transactions/checkin?toolId=${toolId}&userId=${userId}${remarks ? `&remarks=${encodeURIComponent(remarks)}` : ''}`); 