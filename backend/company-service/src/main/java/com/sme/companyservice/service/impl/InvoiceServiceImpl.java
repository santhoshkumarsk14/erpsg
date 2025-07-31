package com.sme.companyservice.service.impl;

import com.sme.companyservice.service.InvoiceService;
import com.sme.companyservice.service.InvoiceServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceServiceImpl implements InvoiceService {
    @Autowired
    private InvoiceServiceClient invoiceServiceClient;

    @Override
    public int getTotalInvoices(String companyId) {
        Integer count = invoiceServiceClient.getTotalInvoices(companyId);
        return count != null ? count : 0;
    }

    @Override
    public double getRevenue(String companyId) {
        Double revenue = invoiceServiceClient.getRevenue(companyId);
        return revenue != null ? revenue : 0.0;
    }
} 