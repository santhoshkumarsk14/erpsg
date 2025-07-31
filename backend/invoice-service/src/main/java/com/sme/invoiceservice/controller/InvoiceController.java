package com.sme.invoiceservice.controller;

import com.sme.invoiceservice.model.Invoice;
import com.sme.invoiceservice.service.InvoiceService;
import com.sme.invoiceservice.model.ApiResponse;
import com.sme.invoiceservice.model.ApprovalLog;
import com.sme.invoiceservice.model.AuditTrailLog;
import com.sme.invoiceservice.model.StatusHistoryLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.sme.invoiceservice.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ApiResponse<List<Invoice>> getAllInvoices() {
        return new ApiResponse<>(true, "Fetched invoices", invoiceService.getAllInvoicesForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return new ApiResponse<>(true, "Created invoice", invoiceService.createInvoice(invoice));
    }

    @PutMapping("/{id}")
    public ApiResponse<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoice) {
        return new ApiResponse<>(true, "Updated invoice", invoiceService.updateInvoice(id, invoice));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteInvoice(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        invoiceService.deleteInvoice(id, userId);
        return new ApiResponse<>(true, "Deleted invoice", null);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportInvoicePdf(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        invoiceService.logExportAction(id, userId, "EXPORT_PDF");
        byte[] pdf = invoiceService.generateInvoicePdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping("/{id}/excel")
    public ResponseEntity<byte[]> exportInvoiceExcel(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        invoiceService.logExportAction(id, userId, "EXPORT_EXCEL");
        byte[] xlsx = invoiceService.generateInvoiceExcel(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "invoice-" + id + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(xlsx);
    }

    @PostMapping("/{id}/submit-approval")
    public ApiResponse<Invoice> submitForApproval(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Submitted for approval", invoiceService.submitForApproval(id, userId, remarks));
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<Invoice> approve(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Invoice approved", invoiceService.approve(id, userId, remarks));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<Invoice> reject(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Invoice rejected", invoiceService.reject(id, userId, remarks));
    }

    @GetMapping("/{id}/approval-logs")
    public ApiResponse<java.util.List<com.sme.invoiceservice.model.ApprovalLog>> getApprovalLogs(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched approval logs", invoiceService.getApprovalLogs(id));
    }

    @GetMapping("/{id}/audit-trail")
    public ApiResponse<java.util.List<com.sme.invoiceservice.model.AuditTrailLog>> getAuditTrail(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched audit trail", invoiceService.getAuditTrailLogs(id));
    }

    @GetMapping("/{id}/status-history")
    public ApiResponse<java.util.List<com.sme.invoiceservice.model.StatusHistoryLog>> getStatusHistory(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched status history", invoiceService.getStatusHistoryLogs(id));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) auth.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }
} 