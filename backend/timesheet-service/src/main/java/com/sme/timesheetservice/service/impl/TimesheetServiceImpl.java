package com.sme.timesheetservice.service.impl;

import com.sme.timesheetservice.exception.ResourceNotFoundException;
import com.sme.timesheetservice.model.Timesheet;
import com.sme.timesheetservice.model.TimesheetStatus;
import com.sme.timesheetservice.payload.request.TimesheetRequest;
import com.sme.timesheetservice.repository.TimesheetRepository;
import com.sme.timesheetservice.repository.WorkingHourConfigRepository;
import com.sme.timesheetservice.service.TaskService;
import com.sme.timesheetservice.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import com.sme.timesheetservice.context.CompanyContext;
import com.sme.timesheetservice.model.WorkingHourConfig;
import com.sme.timesheetservice.model.ApprovalLog;
import com.sme.shared.AuditLog;
import com.sme.timesheetservice.repository.ApprovalLogRepository;
import java.io.ByteArrayOutputStream;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
public class TimesheetServiceImpl implements TimesheetService {

    private static final double STANDARD_WORK_HOURS = 8.0;

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private TaskService taskService;

    @Autowired
    private WorkingHourConfigRepository workingHourConfigRepository;

    @Autowired
    private ApprovalLogRepository approvalLogRepository;

    @Override
    public Timesheet createTimesheet(Timesheet timesheet) {
        timesheet.setCompanyId(CompanyContext.getCompanyId());
        // WorkingHourConfig config = workingHourConfigRepository.findByCompanyId(timesheet.getCompanyId());

        Duration duration = Duration.between(timesheet.getStartTime(), timesheet.getEndTime());
        double totalHours = duration.toMinutes() / 60.0;
        timesheet.setTotalHr(totalHours);

        LocalDate inspectionDate = timesheet.getInspDate();
        DayOfWeek dayOfWeek = inspectionDate.getDayOfWeek();

        double baseHr = 0;
        double otHr = 0;
        double satHr = 0;
        double sunHr = 0;

        if (dayOfWeek == DayOfWeek.SATURDAY) {
            satHr = totalHours;
        } else if (dayOfWeek == DayOfWeek.SUNDAY) {
            sunHr = totalHours;
        } else { // Weekday
            if (totalHours > STANDARD_WORK_HOURS) {
                baseHr = STANDARD_WORK_HOURS;
                otHr = totalHours - STANDARD_WORK_HOURS;
            } else {
                baseHr = totalHours;
            }
        }

        timesheet.setBaseHr(baseHr);
        timesheet.setOtHr(otHr);
        timesheet.setSatHr(satHr);
        timesheet.setSunHr(sunHr);

        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet updateTimesheet(String id, String userId, TimesheetRequest timesheetRequest) {
        Timesheet timesheet = getTimesheetByIdAndUserId(id, userId);
        
        // Only allow updates if the timesheet is in PENDING or REJECTED status
        if (timesheet.getStatus() != TimesheetStatus.PENDING && timesheet.getStatus() != TimesheetStatus.REJECTED) {
            throw new IllegalStateException("Cannot update timesheet that is not in PENDING or REJECTED status");
        }
        
        // If task ID is changing, verify the new task exists
        if (!timesheet.getTaskId().equals(timesheetRequest.getTaskId())) {
            taskService.getTaskById(timesheetRequest.getTaskId());
        }
        
        timesheet.setTaskId(timesheetRequest.getTaskId());
        timesheet.setDate(timesheetRequest.getDate());
        timesheet.setHours(timesheetRequest.getHours());
        timesheet.setDescription(timesheetRequest.getDescription());
        
        // If it was rejected, set it back to pending
        if (timesheet.getStatus() == TimesheetStatus.REJECTED) {
            timesheet.setStatus(TimesheetStatus.PENDING);
        }
        
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet getTimesheetById(String id) {
        return timesheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet not found with id: " + id));
    }
    
    private Timesheet getTimesheetByIdAndUserId(String id, String userId) {
        Timesheet timesheet = getTimesheetById(id);
        
        if (!timesheet.getUserId().equals(userId)) {
            throw new IllegalStateException("Timesheet does not belong to the user");
        }
        
        return timesheet;
    }

    @Override
    public List<Timesheet> getTimesheetsByUserId(String userId) {
        return timesheetRepository.findByUserId(userId);
    }

    @Override
    public List<Timesheet> getTimesheetsByUserIdAndStatus(String userId, TimesheetStatus status) {
        return timesheetRepository.findByUserIdAndStatus(userId, status);
    }

    @Override
    public List<Timesheet> getTimesheetsByTaskId(String taskId) {
        return timesheetRepository.findByTaskId(taskId);
    }

    @Override
    public List<Timesheet> getTimesheetsByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return timesheetRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    @Override
    public List<Timesheet> getTimesheetsByCompanyId(String companyId) {
        return null; // This method is not paginated, returning null to avoid confusion
    }

    @Override
    public List<Timesheet> getTimesheetsByProjectId(String projectId) {
        return timesheetRepository.findByProjectId(projectId);
    }

    @Override
    public Timesheet submitTimesheet(String id, Long userId, String remarks) {
        Timesheet timesheet = getTimesheetById(id);
        
        if (timesheet.getStatus() != TimesheetStatus.PENDING && timesheet.getStatus() != TimesheetStatus.REJECTED) {
            throw new IllegalStateException("Cannot submit timesheet that is not in PENDING or REJECTED status");
        }
        
        timesheet.setStatus(TimesheetStatus.SUBMITTED);
        timesheet.setRemarks(remarks);
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet approveTimesheet(String id, Long approverId, String remarks) {
        Timesheet timesheet = getTimesheetById(id);
        
        if (timesheet.getStatus() != TimesheetStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot approve timesheet that is not in SUBMITTED status");
        }
        
        timesheet.setStatus(TimesheetStatus.APPROVED);
        timesheet.setRemarks(remarks);

        ApprovalLog log = new ApprovalLog();
        log.setTimesheetId(id);
        log.setApproverId(approverId);
        log.setAction("APPROVED");
        log.setRemarks(remarks);
        approvalLogRepository.save(log);

        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet rejectTimesheet(String id, Long approverId, String remarks) {
        Timesheet timesheet = getTimesheetById(id);
        
        if (timesheet.getStatus() != TimesheetStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot reject timesheet that is not in SUBMITTED status");
        }
        
        timesheet.setStatus(TimesheetStatus.REJECTED);
        timesheet.setRemarks(remarks);

        ApprovalLog log = new ApprovalLog();
        log.setTimesheetId(id);
        log.setApproverId(approverId);
        log.setAction("REJECTED");
        log.setRemarks(remarks);
        approvalLogRepository.save(log);

        return timesheetRepository.save(timesheet);
    }

    @Override
    public void deleteTimesheet(String id, String userId) {
        Timesheet timesheet = getTimesheetByIdAndUserId(id, userId);
        
        // Only allow deletion if the timesheet is in PENDING or REJECTED status
        if (timesheet.getStatus() != TimesheetStatus.PENDING && timesheet.getStatus() != TimesheetStatus.REJECTED) {
            throw new IllegalStateException("Cannot delete timesheet that is not in PENDING or REJECTED status");
        }
        
        timesheetRepository.delete(timesheet);
    }

    @Override
    public Page<Timesheet> getAllTimesheetsForCurrentTenant(Pageable pageable) {
        Long companyId = CompanyContext.getCompanyId();
        return timesheetRepository.findByCompanyId(companyId, pageable);
    }

    @Override
    public Timesheet updateTimesheetStatus(String id, String status) {
        Timesheet timesheet = getTimesheetById(id);
        try {
            TimesheetStatus newStatus = TimesheetStatus.valueOf(status.toUpperCase());
            timesheet.setStatus(newStatus);
            return timesheetRepository.save(timesheet);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    @Override
    public byte[] generateTimesheetPdf(String id) {
        Timesheet timesheet = getTimesheetById(id);
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Timesheet"));
            document.add(new Paragraph("ID: " + timesheet.getId()));
            document.add(new Paragraph("User ID: " + timesheet.getUserId()));
            document.add(new Paragraph("Task ID: " + timesheet.getTaskId()));
            document.add(new Paragraph("Date: " + timesheet.getDate()));
            document.add(new Paragraph("Hours: " + timesheet.getHours()));
            document.add(new Paragraph("Status: " + timesheet.getStatus()));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    @Override
    public byte[] generateTimesheetExcel(String id) {
        Timesheet timesheet = getTimesheetById(id);
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Timesheet");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("ID");
            row.createCell(1).setCellValue(timesheet.getId());
            row.createCell(2).setCellValue("User ID");
            row.createCell(3).setCellValue(timesheet.getUserId());
            row.createCell(4).setCellValue("Task ID");
            row.createCell(5).setCellValue(timesheet.getTaskId());
            row.createCell(6).setCellValue("Date");
            row.createCell(7).setCellValue(timesheet.getDate() != null ? timesheet.getDate().toString() : "");
            row.createCell(8).setCellValue("Hours");
            row.createCell(9).setCellValue(timesheet.getHours() != null ? timesheet.getHours().toString() : "");
            row.createCell(10).setCellValue("Status");
            row.createCell(11).setCellValue(timesheet.getStatus() != null ? timesheet.getStatus().toString() : "");
            // ...add more fields as needed...
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel", e);
        }
    }
}