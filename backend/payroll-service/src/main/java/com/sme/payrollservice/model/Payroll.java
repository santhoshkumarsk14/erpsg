package com.sme.payrollservice.model;

import javax.persistence.*;

@Entity
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private Long employeeId;
    private String period;
    private Double amount;
    private String status;
    private String payslipUrl;
    private Double basicPay;
    private Double variablePay;
    private Double allowances;
    private Double bonuses;
    private Double deductions;
    private String payCycle;
    private Double cpfEmployer;
    private Double cpfEmployee;
    private Double sdl;
    private String irasCompliantPdfUrl;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPayslipUrl() { return payslipUrl; }
    public void setPayslipUrl(String payslipUrl) { this.payslipUrl = payslipUrl; }
} 