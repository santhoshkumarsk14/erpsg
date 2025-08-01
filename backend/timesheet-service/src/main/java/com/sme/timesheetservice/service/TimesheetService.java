package com.sme.timesheetservice.service;

import com.sme.timesheetservice.model.Timesheet;
import com.sme.timesheetservice.model.TimesheetStatus;
import com.sme.timesheetservice.payload.request.TimesheetRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface TimesheetService {
    Timesheet createTimesheet(Timesheet timesheet);
    Timesheet updateTimesheet(String id, String userId, TimesheetRequest timesheetRequest);
    Timesheet getTimesheetById(String id);
    List<Timesheet> getTimesheetsByUserId(String userId);
    List<Timesheet> getTimesheetsByUserIdAndStatus(String userId, TimesheetStatus status);
    List<Timesheet> getTimesheetsByTaskId(String taskId);
    List<Timesheet> getTimesheetsByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate);
    List<Timesheet> getTimesheetsByCompanyId(String companyId);
    List<Timesheet> getTimesheetsByProjectId(String projectId);
    Timesheet submitTimesheet(String id, Long userId, String remarks);
    Timesheet approveTimesheet(String id, Long approverId, String remarks);
    Timesheet rejectTimesheet(String id, Long approverId, String remarks);
    Timesheet updateTimesheetStatus(String id, String status);
    void deleteTimesheet(String id, String userId);
    Page<Timesheet> getAllTimesheetsForCurrentTenant(Pageable pageable);
    byte[] generateTimesheetPdf(String id);
    byte[] generateTimesheetExcel(String id);
}