package com.sme.toolsequipmentservice.model;

import javax.persistence.*;

@Entity
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String name;
    private String serialNumber;
    private String status;
    private String location;
    private String assetTag;
    private String make;
    private String model;
    private java.time.LocalDate purchaseDate;
    private java.time.LocalDate maintenanceDate;
    private String imageUrl;
    private String responsiblePerson;
    private Long lastUserId;
    private Boolean overdue;
    private Boolean lost;
    private Boolean missing;
    private String maintenanceSchedule;
    private String maintenanceReminder;
    private String notes;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAssetTag() { return assetTag; }
    public void setAssetTag(String assetTag) { this.assetTag = assetTag; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public java.time.LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(java.time.LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
    public java.time.LocalDate getMaintenanceDate() { return maintenanceDate; }
    public void setMaintenanceDate(java.time.LocalDate maintenanceDate) { this.maintenanceDate = maintenanceDate; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getResponsiblePerson() { return responsiblePerson; }
    public void setResponsiblePerson(String responsiblePerson) { this.responsiblePerson = responsiblePerson; }
    public Long getLastUserId() { return lastUserId; }
    public void setLastUserId(Long lastUserId) { this.lastUserId = lastUserId; }
    public Boolean getOverdue() { return overdue; }
    public void setOverdue(Boolean overdue) { this.overdue = overdue; }
    public Boolean getLost() { return lost; }
    public void setLost(Boolean lost) { this.lost = lost; }
    public Boolean getMissing() { return missing; }
    public void setMissing(Boolean missing) { this.missing = missing; }
    public String getMaintenanceSchedule() { return maintenanceSchedule; }
    public void setMaintenanceSchedule(String maintenanceSchedule) { this.maintenanceSchedule = maintenanceSchedule; }
    public String getMaintenanceReminder() { return maintenanceReminder; }
    public void setMaintenanceReminder(String maintenanceReminder) { this.maintenanceReminder = maintenanceReminder; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
} 