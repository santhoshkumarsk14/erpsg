package com.sme.timesheetservice.payload.response;

import com.sme.timesheetservice.model.Timesheet;
import com.sme.timesheetservice.model.TimesheetStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimesheetResponse {
    private String id;
    private String userId;
    private String taskId;
    private String taskName;
    private String projectId;
    private String projectName;
    private LocalDate date;
    private BigDecimal hours;
    private String description;
    private TimesheetStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static TimesheetResponse fromTimesheet(Timesheet timesheet) {
        TimesheetResponse response = new TimesheetResponse();
        response.setId(timesheet.getId());
        response.setUserId(timesheet.getUserId());
        response.setTaskId(timesheet.getTaskId());
        
        if (timesheet.getTask() != null) {
            response.setTaskName(timesheet.getTask().getName());
            response.setProjectId(timesheet.getTask().getProjectId());
            
            if (timesheet.getTask().getProject() != null) {
                response.setProjectName(timesheet.getTask().getProject().getName());
            }
        }
        
        response.setDate(timesheet.getDate());
        response.setHours(timesheet.getHours());
        response.setDescription(timesheet.getDescription());
        response.setStatus(timesheet.getStatus());
        response.setCreatedAt(timesheet.getCreatedAt());
        response.setUpdatedAt(timesheet.getUpdatedAt());
        return response;
    }
}