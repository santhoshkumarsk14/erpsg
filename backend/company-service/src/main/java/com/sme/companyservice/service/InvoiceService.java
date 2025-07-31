package com.sme.companyservice.service;

public interface InvoiceService {
    int getTotalInvoices(String companyId);
    double getRevenue(String companyId);
} 