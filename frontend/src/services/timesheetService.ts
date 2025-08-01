import api from './api';

export interface Timesheet {
  id: string;
  employeeId: string;
  projectId: string;
  trade: string;
  requestNo: string;
  itemDesc: string;
  module: string;
  subcode: string;
  inspDate: string;
  startTime: string;
  endTime: string;
  location: string;
  baseHr: number;
  otHr: number;
  satHr: number;
  sunHr: number;
  totalHr: number;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  remarks?: string;
}

export interface TimesheetCreateRequest {
  employeeId: string;
  projectId: string;
  trade: string;
  requestNo: string;
  itemDesc: string;
  module: string;
  subcode: string;
  inspDate: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface WorkingHourConfig {
  id: string;
  dayType: 'WEEKDAY' | 'SATURDAY' | 'SUNDAY' | 'PUBLIC_HOLIDAY';
  dayOfWeek?: number; // 1-7 for Monday-Sunday
  baseStartTime: string;
  baseEndTime: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  otStartTime: string;
  otEndTime: string;
  baseHours: number;
  otHours: number;
  multiplier: number;
}

export interface AppendixItem {
  id: string;
  timesheetId: string;
  description: string;
  status: 'INCOMPLETE' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export const getProjects = () => api.get('/api/projects');
export const createProject = (data: any) => api.post('/api/projects', data);
export const updateProject = (id: number, data: any) => api.put(`/api/projects/${id}`, data);
export const deleteProject = (id: number) => api.delete(`/api/projects/${id}`);

export const getTasks = () => api.get('/api/tasks');
export const createTask = (data: any) => api.post('/api/tasks', data);
export const updateTask = (id: number, data: any) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id: number) => api.delete(`/api/tasks/${id}`);

export const getProjects = () => api.get('/api/projects');
export const createProject = (data: any) => api.post('/api/projects', data);
export const updateProject = (id: number, data: any) => api.put(`/api/projects/${id}`, data);
export const deleteProject = (id: number) => api.delete(`/api/projects/${id}`);

export const getTasks = () => api.get('/api/tasks');
export const createTask = (data: any) => api.post('/api/tasks', data);
export const updateTask = (id: number, data: any) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id: number) => api.delete(`/api/tasks/${id}`);

export const createTimesheet = (data: any) => api.post('/api/timesheets', data);
export const approveTimesheet = (id: string, approverId: number, remarks: string) => api.post(`/api/timesheets/${id}/approve?approverId=${approverId}&remarks=${remarks}`);
export const rejectTimesheet = (id: string, approverId: number, remarks: string) => api.post(`/api/timesheets/${id}/reject?approverId=${approverId}&remarks=${remarks}`);
export const updateTimesheetStatus = (id: string, status: string) => api.patch(`/api/timesheets/${id}/status?status=${status}`);
export const downloadTimesheetExcel = (id: string) => api.get(`/api/timesheets/${id}/excel`, { responseType: 'blob' });

const timesheetService = {
  // Get all timesheets with optional filters
  getTimesheets: async (filters?: {
    employeeId?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Timesheet[]; totalElements: number; totalPages: number }> => {
    const response = await api.get('/api/timesheets', { params: filters });
    return response.data.data;
  },
  
  // Get timesheet by ID
  getTimesheet: async (id: string): Promise<Timesheet> => {
    const response = await api.get(`/api/timesheets/${id}`);
    return response.data;
  },
  
  // Create new timesheet
  createTimesheet: async (timesheetData: TimesheetCreateRequest): Promise<Timesheet> => {
    const response = await api.post('/api/timesheets', timesheetData);
    return response.data;
  },
  
  // Update timesheet
  updateTimesheet: async (id: string, timesheetData: Partial<Timesheet>): Promise<Timesheet> => {
    const response = await api.put(`/api/timesheets/${id}`, timesheetData);
    return response.data;
  },
  
  // Delete timesheet
  deleteTimesheet: async (id: string): Promise<void> => {
    await api.delete(`/api/timesheets/${id}`);
  },
  
  // Convert timesheet status to CONVERTED
  convertTimesheet: async (id: string): Promise<Timesheet> => {
    const response = await api.post(`/api/timesheets/${id}/convert`);
    return response.data;
  },
  
  // Bulk convert timesheets
  bulkConvertTimesheets: async (ids: string[]): Promise<Timesheet[]> => {
    const response = await api.post('/api/timesheets/bulk-convert', { ids });
    return response.data;
  },
  
  // Get working hour configurations
  getWorkingHourConfigs: async (): Promise<WorkingHourConfig[]> => {
    const response = await api.get('/api/working-hour-configs');
    return response.data;
  },
  
  // Update working hour configuration
  updateWorkingHourConfig: async (id: string, configData: Partial<WorkingHourConfig>): Promise<WorkingHourConfig> => {
    const response = await api.put(`/api/working-hour-configs/${id}`, configData);
    return response.data;
  },
  
  // Get appendix items for a timesheet
  getAppendixItems: async (timesheetId: string): Promise<AppendixItem[]> => {
    const response = await api.get(`/api/timesheets/${timesheetId}/appendix-items`);
    return response.data;
  },
  
  // Update appendix item status
  updateAppendixItemStatus: async (id: string, status: 'INCOMPLETE' | 'COMPLETED'): Promise<AppendixItem> => {
    const response = await api.put(`/api/appendix-items/${id}/status`, { status });
    return response.data;
  },
  
  // Bulk update appendix item status
  bulkUpdateAppendixItemStatus: async (ids: string[], status: 'INCOMPLETE' | 'COMPLETED'): Promise<AppendixItem[]> => {
    const response = await api.put('/api/appendix-items/bulk-status', { ids, status });
    return response.data;
  },
  
  // Export timesheets to PDF
  exportTimesheetsToPdf: async (filters?: {
    employeeId?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<Blob> => {
    const response = await api.get('/api/timesheets/export/pdf', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Export timesheets to Excel
  exportTimesheetsToExcel: async (filters?: {
    employeeId?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<Blob> => {
    const response = await api.get('/api/timesheets/export/excel', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Export appendix items to PDF
  exportAppendixItemsToPdf: async (timesheetId: string): Promise<Blob> => {
    const response = await api.get(`/api/timesheets/${timesheetId}/appendix-items/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Export appendix items to Excel
  exportAppendixItemsToExcel: async (timesheetId: string): Promise<Blob> => {
    const response = await api.get(`/api/timesheets/${timesheetId}/appendix-items/export/excel`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default timesheetService;