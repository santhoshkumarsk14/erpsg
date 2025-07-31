package com.sme.quoteservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.quoteservice.model.Quote;
import com.sme.quoteservice.repository.QuoteRepository;
import com.sme.quoteservice.service.QuoteService;
import com.sme.invoiceservice.model.Invoice;
import com.sme.invoiceservice.repository.InvoiceRepository;
import com.sme.shared.LineItem;
import com.sme.shared.AuditLog;
import com.sme.shared.ApprovalLog;
import com.sme.shared.StatusHistoryLog;
import com.sme.shared.AuditTrailLog;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.io.ByteArrayOutputStream;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.math.BigDecimal;

@Service
public class QuoteServiceImpl implements QuoteService {
    @Autowired
    private QuoteRepository quoteRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public List<Quote> getAllQuotesForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return quoteRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Quote createQuote(Quote quote) {
        Long companyId = CompanyContext.getCompanyId();
        quote.setCompanyId(companyId);
        quote.setQuoteNumber(generateQuoteNumber(companyId));
        quote.setIssueDate(LocalDate.now());
        quote.setStatus("DRAFT");
        quote.setConvertedToInvoice(false);
        calculateQuoteTotals(quote);
        Quote saved = quoteRepository.save(quote);
        logStatusChange(saved, null, "DRAFT", null, "Created");
        logAuditTrail(saved, "CREATE", null, saved, null, "Created");
        return saved;
    }

    @Override
    public Quote updateQuote(Long quoteId, Quote quote) {
        Quote existing = quoteRepository.findById(quoteId).orElseThrow();
        String oldStatus = existing.getStatus();
        Quote oldCopy = new Quote();
        org.springframework.beans.BeanUtils.copyProperties(existing, oldCopy);
        existing.setClient(quote.getClient());
        existing.setAmount(quote.getAmount());
        existing.setStatus(quote.getStatus());
        existing.setPdfUrl(quote.getPdfUrl());
        existing.setConvertedToInvoice(quote.getConvertedToInvoice());
        existing.setLineItems(quote.getLineItems());
        calculateQuoteTotals(existing);
        Quote saved = quoteRepository.save(existing);
        if (!oldStatus.equals(saved.getStatus())) {
            logStatusChange(saved, oldStatus, saved.getStatus(), null, "Status updated");
        }
        logAuditTrail(saved, "UPDATE", oldCopy, saved, null, "Updated");
        return saved;
    }

    @Override
    public void deleteQuote(Long quoteId, Long userId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        logAuditTrail(quote, "DELETE", quote, quote, userId, "Deleted");
        quoteRepository.deleteById(quoteId);
    }

    @Override
    @Transactional
    public Quote convertToInvoice(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        Invoice invoice = new Invoice();
        invoice.setCompanyId(quote.getCompanyId());
        invoice.setInvoiceNumber(generateInvoiceNumber(quote.getCompanyId()));
        invoice.setIssueDate(java.time.LocalDate.now());
        invoice.setDueDate(quote.getDueDate());
        invoice.setClient(quote.getClient());
        invoice.setAmount(quote.getAmount());
        invoice.setSubtotal(quote.getSubtotal());
        invoice.setDiscount(quote.getDiscount());
        invoice.setTax(quote.getTax());
        invoice.setShipping(quote.getShipping());
        invoice.setGrandTotal(quote.getGrandTotal());
        invoice.setCurrency(quote.getCurrency());
        invoice.setPaymentTerms(quote.getPaymentTerms());
        invoice.setPaymentInstructions(quote.getPaymentInstructions());
        invoice.setNotes(quote.getNotes());
        invoice.setAttachments(quote.getAttachments());
        invoice.setSellerDetails(quote.getSellerDetails());
        invoice.setBuyerDetails(quote.getBuyerDetails());
        invoice.setStatusHistory(quote.getStatusHistory());
        invoice.setApprovalWorkflow(quote.getApprovalWorkflow());
        invoice.setRecurring(quote.getRecurring());
        invoice.setMultiLanguageSupport(quote.getMultiLanguageSupport());
        invoice.setLineItems(new java.util.ArrayList<>());
        for (LineItem item : quote.getLineItems()) {
            LineItem newItem = new LineItem();
            newItem.setParentType("INVOICE");
            newItem.setDescription(item.getDescription());
            newItem.setSku(item.getSku());
            newItem.setQuantity(item.getQuantity());
            newItem.setUnitOfMeasure(item.getUnitOfMeasure());
            newItem.setUnitPrice(item.getUnitPrice());
            newItem.setDiscount(item.getDiscount());
            newItem.setDiscountType(item.getDiscountType());
            newItem.setTaxCode(item.getTaxCode());
            newItem.setTaxRate(item.getTaxRate());
            newItem.setLineSubtotal(item.getLineSubtotal());
            newItem.setNotes(item.getNotes());
            invoice.getLineItems().add(newItem);
        }
        // Recalculate totals for the new invoice
        // (reuse logic from InvoiceServiceImpl if possible)
        // For now, recalculate here:
        List<LineItem> lineItems = invoice.getLineItems();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        if (lineItems != null) {
            for (LineItem item : lineItems) {
                subtotal = subtotal.add(item.getLineSubtotal() != null ? item.getLineSubtotal() : BigDecimal.ZERO);
                totalTax = totalTax.add(item.getLineTaxAmount() != null ? item.getLineTaxAmount() : BigDecimal.ZERO);
                if (item.getDiscount() != null && item.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                    if ("PERCENT".equals(item.getDiscountType())) {
                        totalDiscount = totalDiscount.add(item.getLineSubtotal().multiply(item.getDiscount().divide(new BigDecimal("100"))));
                    } else {
                        totalDiscount = totalDiscount.add(item.getDiscount());
                    }
                }
            }
        }
        BigDecimal headerDiscount = invoice.getDiscount() != null ? BigDecimal.valueOf(invoice.getDiscount()) : BigDecimal.ZERO;
        totalDiscount = totalDiscount.add(headerDiscount);
        BigDecimal shipping = invoice.getShipping() != null ? BigDecimal.valueOf(invoice.getShipping()) : BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.subtract(totalDiscount).add(totalTax).add(shipping);
        invoice.setSubtotal(subtotal.doubleValue());
        invoice.setTax(totalTax.doubleValue());
        invoice.setDiscount(totalDiscount.doubleValue());
        invoice.setShipping(shipping.doubleValue());
        invoice.setGrandTotal(grandTotal.doubleValue());
        invoiceRepository.save(invoice);
        quote.setConvertedToInvoice(true);
        quote.setStatus("CONVERTED");
        // Log in AuditLog (pseudo-code, implement as needed)
        // auditLogRepository.save(new AuditLog(...));
        return quoteRepository.save(quote);
    }

    @Override
    public Quote submitForApproval(Long quoteId, Long userId, String remarks) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        String oldStatus = quote.getStatus();
        quote.setStatus("PENDING_APPROVAL");
        logStatusChange(quote, oldStatus, "PENDING_APPROVAL", userId, remarks);
        logAuditTrail(quote, "SUBMIT_FOR_APPROVAL", quote, quote, userId, remarks);
        if (quote.getApprovalLogs() == null) quote.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(quoteId);
        log.setParentType("QUOTE");
        log.setApproverId(userId);
        log.setAction("SUBMITTED");
        log.setRemarks(remarks);
        quote.getApprovalLogs().add(log);
        return quoteRepository.save(quote);
    }

    @Override
    public Quote approve(Long quoteId, Long userId, String remarks) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        String oldStatus = quote.getStatus();
        quote.setStatus("APPROVED");
        logStatusChange(quote, oldStatus, "APPROVED", userId, remarks);
        logAuditTrail(quote, "APPROVE", quote, quote, userId, remarks);
        if (quote.getApprovalLogs() == null) quote.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(quoteId);
        log.setParentType("QUOTE");
        log.setApproverId(userId);
        log.setAction("APPROVED");
        log.setRemarks(remarks);
        quote.getApprovalLogs().add(log);
        return quoteRepository.save(quote);
    }

    @Override
    public Quote reject(Long quoteId, Long userId, String remarks) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        String oldStatus = quote.getStatus();
        quote.setStatus("REJECTED");
        logStatusChange(quote, oldStatus, "REJECTED", userId, remarks);
        logAuditTrail(quote, "REJECT", quote, quote, userId, remarks);
        if (quote.getApprovalLogs() == null) quote.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(quoteId);
        log.setParentType("QUOTE");
        log.setApproverId(userId);
        log.setAction("REJECTED");
        log.setRemarks(remarks);
        quote.getApprovalLogs().add(log);
        return quoteRepository.save(quote);
    }

    @Override
    public java.util.List<ApprovalLog> getApprovalLogs(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        return quote.getApprovalLogs() != null ? quote.getApprovalLogs() : java.util.Collections.emptyList();
    }

    @Override
    public byte[] generateQuotePdf(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Quote"));
            document.add(new Paragraph("Quote Number: " + quote.getQuoteNumber()));
            document.add(new Paragraph("Client: " + quote.getClient()));
            document.add(new Paragraph("Amount: $" + quote.getAmount()));
            document.add(new Paragraph("Status: " + quote.getStatus()));
            document.add(new Paragraph("Issue Date: " + quote.getIssueDate()));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    @Override
    public byte[] generateQuoteExcel(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Quote");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("Quote Number");
            row.createCell(1).setCellValue(quote.getQuoteNumber());
            row.createCell(2).setCellValue("Client");
            row.createCell(3).setCellValue(quote.getClient());
            row.createCell(4).setCellValue("Amount");
            row.createCell(5).setCellValue(quote.getAmount());
            row.createCell(6).setCellValue("Status");
            row.createCell(7).setCellValue(quote.getStatus());
            row.createCell(8).setCellValue("Issue Date");
            row.createCell(9).setCellValue(quote.getIssueDate() != null ? quote.getIssueDate().toString() : "");
            // ...add more fields as needed...
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel", e);
        }
    }

    @Override
    public void logExportAction(Long quoteId, Long userId, String action) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        logAuditTrail(quote, action, quote, quote, userId, action);
        quoteRepository.save(quote);
    }

    @Override
    public java.util.List<AuditTrailLog> getAuditTrailLogs(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        return quote.getAuditTrailLogs() != null ? quote.getAuditTrailLogs() : java.util.Collections.emptyList();
    }

    @Override
    public java.util.List<StatusHistoryLog> getStatusHistoryLogs(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId).orElseThrow();
        return quote.getStatusHistoryLogs() != null ? quote.getStatusHistoryLogs() : java.util.Collections.emptyList();
    }

    private String generateQuoteNumber(Long companyId) {
        Quote last = quoteRepository.findTopByCompanyIdOrderByIdDesc(companyId);
        int next = 1;
        String prefix = "QTN-" + LocalDate.now().getYear() + String.format("%02d", LocalDate.now().getMonthValue());
        if (last != null && last.getQuoteNumber() != null && last.getQuoteNumber().startsWith(prefix)) {
            String[] parts = last.getQuoteNumber().split("-");
            String seq = parts[2];
            next = Integer.parseInt(seq) + 1;
        }
        return prefix + "-" + String.format("%03d", next);
    }

    private String generateInvoiceNumber(Long companyId) {
        Invoice last = invoiceRepository.findTopByCompanyIdOrderByIdDesc(companyId);
        int next = 1;
        String prefix = "INV-" + LocalDate.now().getYear() + String.format("%02d", LocalDate.now().getMonthValue());
        if (last != null && last.getInvoiceNumber() != null && last.getInvoiceNumber().startsWith(prefix)) {
            String[] parts = last.getInvoiceNumber().split("-");
            String seq = parts[2];
            next = Integer.parseInt(seq) + 1;
        }
        return prefix + "-" + String.format("%03d", next);
    }

    private void calculateQuoteTotals(Quote quote) {
        List<LineItem> lineItems = quote.getLineItems();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        if (lineItems != null) {
            for (LineItem item : lineItems) {
                subtotal = subtotal.add(item.getLineSubtotal() != null ? item.getLineSubtotal() : BigDecimal.ZERO);
                totalTax = totalTax.add(item.getLineTaxAmount() != null ? item.getLineTaxAmount() : BigDecimal.ZERO);
                if (item.getDiscount() != null && item.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                    if ("PERCENT".equals(item.getDiscountType())) {
                        totalDiscount = totalDiscount.add(item.getLineSubtotal().multiply(item.getDiscount().divide(new BigDecimal("100"))));
                    } else {
                        totalDiscount = totalDiscount.add(item.getDiscount());
                    }
                }
            }
        }
        BigDecimal headerDiscount = quote.getDiscount() != null ? BigDecimal.valueOf(quote.getDiscount()) : BigDecimal.ZERO;
        totalDiscount = totalDiscount.add(headerDiscount);
        BigDecimal shipping = quote.getShipping() != null ? BigDecimal.valueOf(quote.getShipping()) : BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.subtract(totalDiscount).add(totalTax).add(shipping);
        quote.setSubtotal(subtotal.doubleValue());
        quote.setTax(totalTax.doubleValue());
        quote.setDiscount(totalDiscount.doubleValue());
        quote.setShipping(shipping.doubleValue());
        quote.setGrandTotal(grandTotal.doubleValue());
    }

    private void logStatusChange(Quote quote, String oldStatus, String newStatus, Long userId, String remarks) {
        if (quote.getStatusHistoryLogs() == null) quote.setStatusHistoryLogs(new java.util.ArrayList<>());
        StatusHistoryLog log = new StatusHistoryLog();
        log.setParentId(quote.getId());
        log.setParentType("QUOTE");
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(userId);
        log.setRemarks(remarks);
        quote.getStatusHistoryLogs().add(log);
    }

    private void logAuditTrail(Quote quote, String action, Quote oldQuote, Quote newQuote, Long userId, String remarks) {
        if (quote.getAuditTrailLogs() == null) quote.setAuditTrailLogs(new java.util.ArrayList<>());
        java.util.List<AuditTrailLog> logs = compareQuotesForAudit(oldQuote, newQuote, action, userId, remarks);
        quote.getAuditTrailLogs().addAll(logs);
    }

    private java.util.List<AuditTrailLog> compareQuotesForAudit(Quote oldQ, Quote newQ, String action, Long userId, String remarks) {
        java.util.List<AuditTrailLog> logs = new java.util.ArrayList<>();
        if (oldQ == null) {
            java.lang.reflect.Field[] fields = Quote.class.getDeclaredFields();
            for (java.lang.reflect.Field field : fields) {
                field.setAccessible(true);
                try {
                    Object newValue = field.get(newQ);
                    if (newValue != null) {
                        AuditTrailLog log = new AuditTrailLog();
                        log.setParentId(newQ.getId());
                        log.setParentType("QUOTE");
                        log.setAction(action);
                        log.setFieldName(field.getName());
                        log.setOldValue(null);
                        log.setNewValue(newValue.toString());
                        log.setChangedBy(userId);
                        log.setRemarks(remarks);
                        logs.add(log);
                    }
                } catch (Exception ignored) {}
            }
        } else {
            java.lang.reflect.Field[] fields = Quote.class.getDeclaredFields();
            for (java.lang.reflect.Field field : fields) {
                field.setAccessible(true);
                try {
                    Object oldValue = field.get(oldQ);
                    Object newValue = field.get(newQ);
                    if (oldValue == null && newValue == null) continue;
                    if (oldValue == null || newValue == null || !oldValue.equals(newValue)) {
                        AuditTrailLog log = new AuditTrailLog();
                        log.setParentId(newQ.getId());
                        log.setParentType("QUOTE");
                        log.setAction(action);
                        log.setFieldName(field.getName());
                        log.setOldValue(oldValue != null ? oldValue.toString() : null);
                        log.setNewValue(newValue != null ? newValue.toString() : null);
                        log.setChangedBy(userId);
                        log.setRemarks(remarks);
                        logs.add(log);
                    }
                } catch (Exception ignored) {}
            }
        }
        return logs;
    }
} 