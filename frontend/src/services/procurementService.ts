import api from './api';

// Purchase Orders
export const getPurchaseOrders = () => api.get('/api/purchase-orders');
export const createPurchaseOrder = (data: any) => api.post('/api/purchase-orders', data);
export const updatePurchaseOrder = (id: number, data: any) => api.put(`/api/purchase-orders/${id}`, data);
export const deletePurchaseOrder = (id: number) => api.delete(`/api/purchase-orders/${id}`);
export const downloadPurchaseOrderExcel = (id: number) => api.get(`/api/purchase-orders/${id}/excel`, { responseType: 'blob' });

// Suppliers
export const getSuppliers = () => api.get('/api/suppliers');
export const createSupplier = (data: any) => api.post('/api/suppliers', data);
export const updateSupplier = (id: number, data: any) => api.put(`/api/suppliers/${id}`, data);
export const deleteSupplier = (id: number) => api.delete(`/api/suppliers/${id}`);

// Inventory Items
export const getInventoryItems = () => api.get('/api/inventory-items');
export const createInventoryItem = (data: any) => api.post('/api/inventory-items', data);
export const updateInventoryItem = (id: number, data: any) => api.put(`/api/inventory-items/${id}`, data);
export const deleteInventoryItem = (id: number) => api.delete(`/api/inventory-items/${id}`);