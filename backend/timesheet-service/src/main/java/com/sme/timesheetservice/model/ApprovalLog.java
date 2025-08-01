package com.sme.timesheetservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ApprovalLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String timesheetId;
    private Long approverId;
    private String action; // APPROVED, REJECTED, etc.
    private String remarks;
    private LocalDateTime timestamp;

    public Long getId() { return id; }  
    public void setId(Long id) { this.id = id; }
    public String getTimesheetId() { return timesheetId; }
    public void setTimesheetId(String timesheetId) { this.timesheetId = timesheetId; }
    public Long getApproverId() { return approverId; }
    public void setApproverId(Long approverId) { this.approverId = approverId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }   

} 