package com.sme.companyservice.model;

public class CompanyOnboardingRequest {
    private String companyName;
    private String adminEmail;
    private String adminPassword;
    private String adminName;
    private CompanyPlan plan;

    // Getters and setters
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }
    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }
    public CompanyPlan getPlan() { return plan; }
    public void setPlan(CompanyPlan plan) { this.plan = plan; }
} 