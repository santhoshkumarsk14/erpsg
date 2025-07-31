package com.sme.invoiceservice.model;

import java.time.LocalDateTime;

public class ApprovalLog {
    private Long id;
    private Long parentId; // Invoice, Quote, or PO ID
    private String parentType; // 'INVOICE', 'QUOTE', 'PO'
    private Long approverId;
    private String action; // APPROVED, REJECTED, SUBMITTED, etc.
    private String remarks;
    private LocalDateTime timestamp;

    public ApprovalLog() {
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    public String getParentType() { return parentType; }
    public void setParentType(String parentType) { this.parentType = parentType; }
    public Long getApproverId() { return approverId; }
    public void setApproverId(Long approverId) { this.approverId = approverId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
} 