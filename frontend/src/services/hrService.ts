import api from './api';

export const getEmployees = () => api.get('/api/employees');
export const createEmployee = (data: any) => api.post('/api/employees', data);
export const updateEmployee = (id: number, data: any) => api.put(`/api/employees/${id}`, data);
export const deleteEmployee = (id: number) => api.delete(`/api/employees/${id}`);

export const getAttendances = () => api.get('/api/attendance');
export const getAttendanceById = (id: number) => api.get(`/api/attendance/${id}`);
export const createAttendance = (data: any) => api.post('/api/attendance', data);
export const updateAttendance = (id: number, data: any) => api.put(`/api/attendance/${id}`, data);
export const deleteAttendance = (id: number) => api.delete(`/api/attendance/${id}`); 