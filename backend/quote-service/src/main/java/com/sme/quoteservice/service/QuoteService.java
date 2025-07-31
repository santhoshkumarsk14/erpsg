package com.sme.quoteservice.service;

import com.sme.quoteservice.model.Quote;
import java.util.List;

public interface QuoteService {
    List<Quote> getAllQuotesForCurrentTenant();
    Quote createQuote(Quote quote);
    Quote updateQuote(Long quoteId, Quote quote);
    void deleteQuote(Long quoteId, Long userId);
    Quote convertToInvoice(Long quoteId);
    byte[] generateQuotePdf(Long quoteId);
    byte[] generateQuoteExcel(Long quoteId);
    Quote submitForApproval(Long quoteId, Long userId, String remarks);
    Quote approve(Long quoteId, Long userId, String remarks);
    Quote reject(Long quoteId, Long userId, String remarks);
    java.util.List<com.sme.shared.ApprovalLog> getApprovalLogs(Long quoteId);
    void logExportAction(Long quoteId, Long userId, String action);
    java.util.List<com.sme.shared.AuditTrailLog> getAuditTrailLogs(Long quoteId);
    java.util.List<com.sme.shared.StatusHistoryLog> getStatusHistoryLogs(Long quoteId);
} 