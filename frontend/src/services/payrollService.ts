import api from './api';

export const getPayrolls = () => api.get('/api/payrolls');
export const createPayroll = (data: any) => api.post('/api/payrolls', data);
export const updatePayroll = (id: number, data: any) => api.put(`/api/payrolls/${id}`, data);
export const deletePayroll = (id: number) => api.delete(`/api/payrolls/${id}`);
export const downloadPayrollSlipPdf = (id: number) => api.get(`/api/payrolls/${id}/pdf`, { responseType: 'blob' });
export const calculateCpfSdl = (id: number) => api.get(`/api/payrolls/${id}/cpf-sdl-calc`); 
export const downloadPayrollExcel = (id: number) => api.get(`/api/payrolls/${id}/excel`, { responseType: 'blob' }); 