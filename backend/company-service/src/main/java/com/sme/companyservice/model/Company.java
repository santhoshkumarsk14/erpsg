package com.sme.companyservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "companies")
public class Company {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column
    private String industry;

    @Column(name = "employee_count")
    private String employeeCount;

    @Column
    private String address;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    @Column
    private String phone;

    @Column
    private String website;

    @Column
    private String logo;

    @Column(name = "subscription_plan")
    @Enumerated(EnumType.STRING)
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.BASIC;

    @Column(name = "subscription_status")
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus subscriptionStatus = SubscriptionStatus.ACTIVE;

    @Column(name = "subscription_expiry")
    private LocalDateTime subscriptionExpiry;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column
    private CompanyPlan plan;

    @Column(name = "company_id", nullable = false)
    private String companyId;

    public Company() {}

    public Company(String id, String name, String industry, String employeeCount, String address, String city, String state, String country, String postalCode, String phone, String website, String logo, SubscriptionPlan subscriptionPlan, SubscriptionStatus subscriptionStatus, LocalDateTime subscriptionExpiry, LocalDateTime createdAt, LocalDateTime updatedAt, CompanyPlan plan, String companyId) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.employeeCount = employeeCount;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
        this.phone = phone;
        this.website = website;
        this.logo = logo;
        this.subscriptionPlan = subscriptionPlan;
        this.subscriptionStatus = subscriptionStatus;
        this.subscriptionExpiry = subscriptionExpiry;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.plan = plan;
        this.companyId = companyId;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(String employeeCount) { this.employeeCount = employeeCount; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public SubscriptionPlan getSubscriptionPlan() { return subscriptionPlan; }
    public void setSubscriptionPlan(SubscriptionPlan subscriptionPlan) { this.subscriptionPlan = subscriptionPlan; }

    public SubscriptionStatus getSubscriptionStatus() { return subscriptionStatus; }
    public void setSubscriptionStatus(SubscriptionStatus subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }

    public LocalDateTime getSubscriptionExpiry() { return subscriptionExpiry; }
    public void setSubscriptionExpiry(LocalDateTime subscriptionExpiry) { this.subscriptionExpiry = subscriptionExpiry; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public CompanyPlan getPlan() { return plan; }
    public void setPlan(CompanyPlan plan) { this.plan = plan; }

    public String getCompanyId() { return companyId; }
    public void setCompanyId(String companyId) { this.companyId = companyId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Company company = (Company) o;
        return Objects.equals(id, company.id) &&
                Objects.equals(name, company.name) &&
                Objects.equals(industry, company.industry) &&
                Objects.equals(employeeCount, company.employeeCount) &&
                Objects.equals(address, company.address) &&
                Objects.equals(city, company.city) &&
                Objects.equals(state, company.state) &&
                Objects.equals(country, company.country) &&
                Objects.equals(postalCode, company.postalCode) &&
                Objects.equals(phone, company.phone) &&
                Objects.equals(website, company.website) &&
                Objects.equals(logo, company.logo) &&
                subscriptionPlan == company.subscriptionPlan &&
                subscriptionStatus == company.subscriptionStatus &&
                Objects.equals(subscriptionExpiry, company.subscriptionExpiry) &&
                Objects.equals(createdAt, company.createdAt) &&
                Objects.equals(updatedAt, company.updatedAt) &&
                plan == company.plan &&
                Objects.equals(companyId, company.companyId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, industry, employeeCount, address, city, state, country, postalCode, phone, website, logo, subscriptionPlan, subscriptionStatus, subscriptionExpiry, createdAt, updatedAt, plan, companyId);
    }

    @Override
    public String toString() {
        return "Company{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", industry='" + industry + '\'' +
                ", employeeCount='" + employeeCount + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", country='" + country + '\'' +
                ", postalCode='" + postalCode + '\'' +
                ", phone='" + phone + '\'' +
                ", website='" + website + '\'' +
                ", logo='" + logo + '\'' +
                ", subscriptionPlan=" + subscriptionPlan +
                ", subscriptionStatus=" + subscriptionStatus +
                ", subscriptionExpiry=" + subscriptionExpiry +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", plan=" + plan +
                ", companyId='" + companyId + '\'' +
                '}';
    }
}