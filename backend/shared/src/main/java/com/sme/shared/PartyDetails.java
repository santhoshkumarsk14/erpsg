package com.sme.shared;

import jakarta.persistence.Embeddable;

@Embeddable
public class PartyDetails {
    private String name;
    private String registeredAddress;
    private String uen; // Unique Entity Number (SG)
    private String businessRegNo;
    private String phone;
    private String email;
    private String gstId; // GST/Tax ID
    private String country;
    private String vatId; // For overseas

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRegisteredAddress() { return registeredAddress; }
    public void setRegisteredAddress(String registeredAddress) { this.registeredAddress = registeredAddress; }
    public String getUen() { return uen; }
    public void setUen(String uen) { this.uen = uen; }
    public String getBusinessRegNo() { return businessRegNo; }
    public void setBusinessRegNo(String businessRegNo) { this.businessRegNo = businessRegNo; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGstId() { return gstId; }
    public void setGstId(String gstId) { this.gstId = gstId; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getVatId() { return vatId; }
    public void setVatId(String vatId) { this.vatId = vatId; }
} 