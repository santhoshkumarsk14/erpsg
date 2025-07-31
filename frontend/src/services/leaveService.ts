import api from './api';

export const getLeaveRequests = () => api.get('/api/leaves');
export const createLeaveRequest = (data: any) => api.post('/api/leaves', data);
export const updateLeaveRequest = (id: number, data: any) => api.put(`/api/leaves/${id}`, data);
export const deleteLeaveRequest = (id: number) => api.delete(`/api/leaves/${id}`);
export const approveLeaveRequest = (id: number) => api.post(`/api/leaves/${id}/approve`);
export const rejectLeaveRequest = (id: number, reason: string) => api.post(`/api/leaves/${id}/reject?reason=${encodeURIComponent(reason)}`);
export const uploadSupportingDocument = (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/api/leaves/${id}/upload-doc`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const exportLeaveAsCalendar = (id: number) => api.get(`/api/leaves/${id}/calendar`, { responseType: 'blob' });
export const downloadLeaveExcel = (id: number) => api.get(`/api/leaves/${id}/excel`, { responseType: 'blob' }); 