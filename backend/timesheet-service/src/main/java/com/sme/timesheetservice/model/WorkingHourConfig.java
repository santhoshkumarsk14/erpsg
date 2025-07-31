package com.sme.timesheetservice.model;

import jakarta.persistence.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class WorkingHourConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String baseStart;
    private String baseEnd;
    private String otStart;
    private String otEnd;
    private String breakStart;
    private String breakEnd;
    private Double otMultiplier;
    private Double satMultiplier;
    private Double sunMultiplier;
    private String publicHolidays; // JSON array of dates

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getBaseStart() { return baseStart; }
    public void setBaseStart(String baseStart) { this.baseStart = baseStart; }
    public String getBaseEnd() { return baseEnd; }  
    public void setBaseEnd(String baseEnd) { this.baseEnd = baseEnd; }
    public String getOtStart() { return otStart; }
    public void setOtStart(String otStart) { this.otStart = otStart; }
    public String getOtEnd() { return otEnd; }
    public void setOtEnd(String otEnd) { this.otEnd = otEnd; }
    public String getBreakStart() { return breakStart; }
    public void setBreakStart(String breakStart) { this.breakStart = breakStart; }
    public String getBreakEnd() { return breakEnd; }
    public void setBreakEnd(String breakEnd) { this.breakEnd = breakEnd; }
    public Double getOtMultiplier() { return otMultiplier; }
    public void setOtMultiplier(Double otMultiplier) { this.otMultiplier = otMultiplier; }
    public Double getSatMultiplier() { return satMultiplier; }
    public void setSatMultiplier(Double satMultiplier) { this.satMultiplier = satMultiplier; }
    public Double getSunMultiplier() { return sunMultiplier; }
    public void setSunMultiplier(Double sunMultiplier) { this.sunMultiplier = sunMultiplier; }
    public String getPublicHolidays() { return publicHolidays; }
    public void setPublicHolidays(String publicHolidays) { this.publicHolidays = publicHolidays; }  
            
} 