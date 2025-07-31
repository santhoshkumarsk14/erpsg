import api from './api';

export const getNotificationsForCompany = (companyId: number) => api.get(`/api/notifications/company/${companyId}`);
export const getNotificationsForUser = (userId: number) => api.get(`/api/notifications/user/${userId}`);
export const markNotificationAsRead = (id: number) => api.post(`/api/notifications/${id}/read`); 