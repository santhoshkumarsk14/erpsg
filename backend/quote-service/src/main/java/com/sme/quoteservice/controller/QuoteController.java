package com.sme.quoteservice.controller;

import com.sme.quoteservice.model.Quote;
import com.sme.quoteservice.service.QuoteService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {
    @Autowired
    private QuoteService quoteService;

    @GetMapping
    public ApiResponse<List<Quote>> getAllQuotes() {
        return new ApiResponse<>(true, "Fetched quotes", quoteService.getAllQuotesForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<Quote> createQuote(@RequestBody Quote quote) {
        return new ApiResponse<>(true, "Created quote", quoteService.createQuote(quote));
    }

    @PutMapping("/{id}")
    public ApiResponse<Quote> updateQuote(@PathVariable Long id, @RequestBody Quote quote) {
        return new ApiResponse<>(true, "Updated quote", quoteService.updateQuote(id, quote));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteQuote(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        quoteService.deleteQuote(id, userId);
        return new ApiResponse<>(true, "Deleted quote", null);
    }

    @PostMapping("/{id}/convert")
    public ApiResponse<Quote> convertToInvoice(@PathVariable Long id) {
        return new ApiResponse<>(true, "Converted to invoice", quoteService.convertToInvoice(id));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportQuotePdf(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        quoteService.logExportAction(id, userId, "EXPORT_PDF");
        byte[] pdf = quoteService.generateQuotePdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "quote-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping("/{id}/excel")
    public ResponseEntity<byte[]> exportQuoteExcel(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        quoteService.logExportAction(id, userId, "EXPORT_EXCEL");
        byte[] xlsx = quoteService.generateQuoteExcel(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "quote-" + id + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(xlsx);
    }

    @PostMapping("/{id}/submit-approval")
    public ApiResponse<Quote> submitForApproval(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Submitted for approval", quoteService.submitForApproval(id, userId, remarks));
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<Quote> approve(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Quote approved", quoteService.approve(id, userId, remarks));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<Quote> reject(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Quote rejected", quoteService.reject(id, userId, remarks));
    }

    @GetMapping("/{id}/approval-logs")
    public ApiResponse<java.util.List<com.sme.shared.ApprovalLog>> getApprovalLogs(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched approval logs", quoteService.getApprovalLogs(id));
    }

    @GetMapping("/{id}/audit-trail")
    public ApiResponse<java.util.List<com.sme.shared.AuditTrailLog>> getAuditTrail(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched audit trail", quoteService.getAuditTrailLogs(id));
    }

    @GetMapping("/{id}/status-history")
    public ApiResponse<java.util.List<com.sme.shared.StatusHistoryLog>> getStatusHistory(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched status history", quoteService.getStatusHistoryLogs(id));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.sme.userservice.security.services.UserDetailsImpl) {
            return ((com.sme.userservice.security.services.UserDetailsImpl) auth.getPrincipal()).getId();
        }
        // fallback or throw
        return null;
    }
} 