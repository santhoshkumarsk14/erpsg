package com.sme.timesheetservice.service;

import com.sme.timesheetservice.model.Timesheet;
import com.sme.timesheetservice.model.TimesheetStatus;
import com.sme.timesheetservice.payload.request.TimesheetRequest;
import java.time.LocalDate;
import java.util.List;

public interface TimesheetService {
    Timesheet createTimesheet(String userId, TimesheetRequest timesheetRequest);
    Timesheet updateTimesheet(String id, String userId, TimesheetRequest timesheetRequest);
    Timesheet getTimesheetById(String id);
    List<Timesheet> getTimesheetsByUserId(String userId);
    List<Timesheet> getTimesheetsByUserIdAndStatus(String userId, TimesheetStatus status);
    List<Timesheet> getTimesheetsByTaskId(String taskId);
    List<Timesheet> getTimesheetsByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate);
    List<Timesheet> getTimesheetsByCompanyId(String companyId);
    List<Timesheet> getTimesheetsByProjectId(String projectId);
    Timesheet submitTimesheet(String id, String userId);
    Timesheet approveTimesheet(String id);
    Timesheet rejectTimesheet(String id, String reason);
    void deleteTimesheet(String id, String userId);
    List<Timesheet> getAllTimesheetsForCurrentTenant();
    byte[] generateTimesheetPdf(String id);
    byte[] generateTimesheetExcel(String id);
}