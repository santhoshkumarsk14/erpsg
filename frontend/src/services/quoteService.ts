import api from './api';

export const getQuotes = () => api.get('/api/quotes');
export const createQuote = (data: any) => api.post('/api/quotes', data);
export const updateQuote = (id: number, data: any) => api.put(`/api/quotes/${id}`, data);
export const deleteQuote = (id: number) => api.delete(`/api/quotes/${id}`);
export const convertToInvoice = (id: number) => api.post(`/api/quotes/${id}/convert`);
export const downloadQuoteExcel = (id: number) => api.get(`/api/quotes/${id}/excel`, { responseType: 'blob' });