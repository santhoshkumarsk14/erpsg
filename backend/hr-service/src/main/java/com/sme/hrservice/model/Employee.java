package com.sme.hrservice.model;

import javax.persistence.*;

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String name;
    private String email;
    private String position;
    private String department;
    private String benefits;
    private String bankAccount;
    private Boolean cpfOptIn;
    private Boolean sdlOptIn;
    private String employmentHistory; // JSON or separate entity
    private java.time.LocalDate contractStart;
    private java.time.LocalDate contractEnd;
    private String nextOfKin;
    private Long supervisorId;
    private Double leaveBalance;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public Double getLeaveBalance() { return leaveBalance; }
    public void setLeaveBalance(Double leaveBalance) { this.leaveBalance = leaveBalance; }
} 