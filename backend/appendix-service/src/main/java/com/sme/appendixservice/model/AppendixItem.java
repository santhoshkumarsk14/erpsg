package com.sme.appendixservice.model;

import javax.persistence.*;

@Entity
public class AppendixItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long appendixId;
    private String description;
    private String status;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAppendixId() { return appendixId; }
    public void setAppendixId(Long appendixId) { this.appendixId = appendixId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 