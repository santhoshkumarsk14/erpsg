package com.sme.companyservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "invoice-service", url = "http://localhost:8084")
public interface InvoiceServiceClient {
    @GetMapping("/api/invoices/count")
    Integer getTotalInvoices(@RequestHeader("X-Company-ID") String companyId);

    @GetMapping("/api/invoices/revenue")
    Double getRevenue(@RequestHeader("X-Company-ID") String companyId);
} 