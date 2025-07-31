package com.sme.invoiceservice.service;

import com.sme.invoiceservice.model.Invoice;
import com.sme.invoiceservice.model.ApprovalLog;
import com.sme.invoiceservice.model.AuditTrailLog;
import com.sme.invoiceservice.model.StatusHistoryLog;
import java.util.List;

public interface InvoiceService {
    List<Invoice> getAllInvoicesForCurrentTenant();
    Invoice createInvoice(Invoice invoice);
    Invoice updateInvoice(Long invoiceId, Invoice invoice);
    void deleteInvoice(Long invoiceId, Long userId);
    byte[] generateInvoicePdf(Long invoiceId);
    byte[] generateInvoiceExcel(Long invoiceId);
    Invoice submitForApproval(Long invoiceId, Long userId, String remarks);
    Invoice approve(Long invoiceId, Long userId, String remarks);
    Invoice reject(Long invoiceId, Long userId, String remarks);
    java.util.List<ApprovalLog> getApprovalLogs(Long invoiceId);
    void logExportAction(Long invoiceId, Long userId, String action);
    java.util.List<AuditTrailLog> getAuditTrailLogs(Long invoiceId);
    java.util.List<StatusHistoryLog> getStatusHistoryLogs(Long invoiceId);
} 