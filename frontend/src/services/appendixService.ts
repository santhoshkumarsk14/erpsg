import api from './api';

// Appendix
export const getAppendices = () => api.get('/api/appendices');
export const getAppendicesByTimesheet = (timesheetId: number) => api.get(`/api/appendices/timesheet/${timesheetId}`);
export const createAppendix = (data: any) => api.post('/api/appendices', data);
export const updateAppendix = (id: number, data: any) => api.put(`/api/appendices/${id}`, data);
export const deleteAppendix = (id: number) => api.delete(`/api/appendices/${id}`);
export const downloadAppendixExcel = (id: number) => api.get(`/api/appendices/${id}/excel`, { responseType: 'blob' });

// Appendix Items
export const getAppendixItems = (appendixId: number) => api.get(`/api/appendix-items/appendix/${appendixId}`);
export const createAppendixItem = (data: any) => api.post('/api/appendix-items', data);
export const updateAppendixItem = (id: number, data: any) => api.put(`/api/appendix-items/${id}`, data);
export const deleteAppendixItem = (id: number) => api.delete(`/api/appendix-items/${id}`);
export const bulkUpdateAppendixItems = (appendixId: number, items: any[]) => api.put(`/api/appendix-items/bulk/${appendixId}`, items); 