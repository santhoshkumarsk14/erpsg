package com.sme.invoiceservice.model;

import java.time.LocalDateTime;

public class StatusHistoryLog {
    private Long id;
    private Long parentId; // Invoice, Quote, or PO ID
    private String parentType; // 'INVOICE', 'QUOTE', 'PO'
    private String oldStatus;
    private String newStatus;
    private Long changedBy;
    private LocalDateTime changedAt;
    private String remarks;

    public StatusHistoryLog() {
        this.changedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    public String getParentType() { return parentType; }
    public void setParentType(String parentType) { this.parentType = parentType; }
    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }
    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }
    public Long getChangedBy() { return changedBy; }
    public void setChangedBy(Long changedBy) { this.changedBy = changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
} 