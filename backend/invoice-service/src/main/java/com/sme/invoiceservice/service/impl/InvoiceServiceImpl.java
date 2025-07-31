package com.sme.invoiceservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.invoiceservice.model.Invoice;
import com.sme.invoiceservice.repository.InvoiceRepository;
import com.sme.invoiceservice.service.InvoiceService;
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
import com.sme.shared.LineItem;
import com.sme.shared.ApprovalLog;
import com.sme.shared.StatusHistoryLog;
import com.sme.shared.AuditTrailLog;

@Service
public class InvoiceServiceImpl implements InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public List<Invoice> getAllInvoicesForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return invoiceRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        Long companyId = CompanyContext.getCompanyId();
        invoice.setCompanyId(companyId);
        invoice.setInvoiceNumber(generateInvoiceNumber(companyId));
        invoice.setIssueDate(LocalDate.now());
        invoice.setStatus("DRAFT");
        invoice.setEmailSent(false);
        calculateInvoiceTotals(invoice);
        Invoice saved = invoiceRepository.save(invoice);
        // Log creation
        logStatusChange(saved, null, "DRAFT", null, "Created");
        logAuditTrail(saved, "CREATE", null, saved, null, "Created");
        return saved;
    }

    @Override
    public Invoice updateInvoice(Long invoiceId, Invoice invoice) {
        Invoice existing = invoiceRepository.findById(invoiceId).orElseThrow();
        String oldStatus = existing.getStatus();
        Invoice oldCopy = new Invoice();
        org.springframework.beans.BeanUtils.copyProperties(existing, oldCopy);
        existing.setClient(invoice.getClient());
        existing.setAmount(invoice.getAmount());
        existing.setStatus(invoice.getStatus());
        existing.setDueDate(invoice.getDueDate());
        existing.setPdfUrl(invoice.getPdfUrl());
        existing.setEmailSent(invoice.getEmailSent());
        existing.setLineItems(invoice.getLineItems());
        calculateInvoiceTotals(existing);
        Invoice saved = invoiceRepository.save(existing);
        // Log status change if changed
        if (!oldStatus.equals(saved.getStatus())) {
            logStatusChange(saved, oldStatus, saved.getStatus(), null, "Status updated");
        }
        logAuditTrail(saved, "UPDATE", oldCopy, saved, null, "Updated");
        return saved;
    }

    @Override
    public void deleteInvoice(Long invoiceId, Long userId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        logAuditTrail(invoice, "DELETE", invoice, invoice, userId, "Deleted");
        invoiceRepository.deleteById(invoiceId);
    }

    @Override
    public void logExportAction(Long invoiceId, Long userId, String action) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        logAuditTrail(invoice, action, invoice, invoice, userId, action);
        invoiceRepository.save(invoice);
    }

    @Override
    public byte[] generateInvoicePdf(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Invoice"));
            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Client: " + invoice.getClient()));
            document.add(new Paragraph("Amount: $" + invoice.getAmount()));
            document.add(new Paragraph("Status: " + invoice.getStatus()));
            document.add(new Paragraph("Issue Date: " + invoice.getIssueDate()));
            document.add(new Paragraph("Due Date: " + invoice.getDueDate()));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    @Override
    public byte[] generateInvoiceExcel(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Invoice");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("Invoice Number");
            row.createCell(1).setCellValue(invoice.getInvoiceNumber());
            row.createCell(2).setCellValue("Client");
            row.createCell(3).setCellValue(invoice.getClient());
            row.createCell(4).setCellValue("Amount");
            row.createCell(5).setCellValue(invoice.getAmount());
            row.createCell(6).setCellValue("Status");
            row.createCell(7).setCellValue(invoice.getStatus());
            row.createCell(8).setCellValue("Issue Date");
            row.createCell(9).setCellValue(invoice.getIssueDate() != null ? invoice.getIssueDate().toString() : "");
            row.createCell(10).setCellValue("Due Date");
            row.createCell(11).setCellValue(invoice.getDueDate() != null ? invoice.getDueDate().toString() : "");
            // ...add more fields as needed...
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel", e);
        }
    }

    @Override
    public Invoice submitForApproval(Long invoiceId, Long userId, String remarks) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        String oldStatus = invoice.getStatus();
        invoice.setStatus("PENDING_APPROVAL");
        logStatusChange(invoice, oldStatus, "PENDING_APPROVAL", userId, remarks);
        logAuditTrail(invoice, "SUBMIT_FOR_APPROVAL", invoice, invoice, userId, remarks);
        if (invoice.getApprovalLogs() == null) invoice.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(invoiceId);
        log.setParentType("INVOICE");
        log.setApproverId(userId);
        log.setAction("SUBMITTED");
        log.setRemarks(remarks);
        invoice.getApprovalLogs().add(log);
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice approve(Long invoiceId, Long userId, String remarks) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        String oldStatus = invoice.getStatus();
        invoice.setStatus("APPROVED");
        logStatusChange(invoice, oldStatus, "APPROVED", userId, remarks);
        logAuditTrail(invoice, "APPROVE", invoice, invoice, userId, remarks);
        if (invoice.getApprovalLogs() == null) invoice.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(invoiceId);
        log.setParentType("INVOICE");
        log.setApproverId(userId);
        log.setAction("APPROVED");
        log.setRemarks(remarks);
        invoice.getApprovalLogs().add(log);
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice reject(Long invoiceId, Long userId, String remarks) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        String oldStatus = invoice.getStatus();
        invoice.setStatus("REJECTED");
        logStatusChange(invoice, oldStatus, "REJECTED", userId, remarks);
        logAuditTrail(invoice, "REJECT", invoice, invoice, userId, remarks);
        if (invoice.getApprovalLogs() == null) invoice.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(invoiceId);
        log.setParentType("INVOICE");
        log.setApproverId(userId);
        log.setAction("REJECTED");
        log.setRemarks(remarks);
        invoice.getApprovalLogs().add(log);
        return invoiceRepository.save(invoice);
    }

    @Override
    public java.util.List<ApprovalLog> getApprovalLogs(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        return invoice.getApprovalLogs() != null ? invoice.getApprovalLogs() : java.util.Collections.emptyList();
    }

    @Override
    public java.util.List<AuditTrailLog> getAuditTrailLogs(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        return invoice.getAuditTrailLogs() != null ? invoice.getAuditTrailLogs() : java.util.Collections.emptyList();
    }

    @Override
    public java.util.List<StatusHistoryLog> getStatusHistoryLogs(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        return invoice.getStatusHistoryLogs() != null ? invoice.getStatusHistoryLogs() : java.util.Collections.emptyList();
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

    private void calculateInvoiceTotals(Invoice invoice) {
        List<LineItem> lineItems = invoice.getLineItems();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        if (lineItems != null) {
            for (LineItem item : lineItems) {
                subtotal = subtotal.add(item.getLineSubtotal() != null ? item.getLineSubtotal() : BigDecimal.ZERO);
                totalTax = totalTax.add(item.getLineTaxAmount() != null ? item.getLineTaxAmount() : BigDecimal.ZERO);
                // Optionally sum line-level discounts if needed
                if (item.getDiscount() != null && item.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                    if ("PERCENT".equals(item.getDiscountType())) {
                        totalDiscount = totalDiscount.add(item.getLineSubtotal().multiply(item.getDiscount().divide(new BigDecimal("100"))));
                    } else {
                        totalDiscount = totalDiscount.add(item.getDiscount());
                    }
                }
            }
        }
        // Header-level discount
        BigDecimal headerDiscount = invoice.getDiscount() != null ? BigDecimal.valueOf(invoice.getDiscount()) : BigDecimal.ZERO;
        totalDiscount = totalDiscount.add(headerDiscount);
        // Shipping
        BigDecimal shipping = invoice.getShipping() != null ? BigDecimal.valueOf(invoice.getShipping()) : BigDecimal.ZERO;
        // Grand total
        BigDecimal grandTotal = subtotal.subtract(totalDiscount).add(totalTax).add(shipping);
        invoice.setSubtotal(subtotal.doubleValue());
        invoice.setTax(totalTax.doubleValue());
        invoice.setDiscount(totalDiscount.doubleValue());
        invoice.setShipping(shipping.doubleValue());
        invoice.setGrandTotal(grandTotal.doubleValue());
    }

    private void logStatusChange(Invoice invoice, String oldStatus, String newStatus, Long userId, String remarks) {
        if (invoice.getStatusHistoryLogs() == null) invoice.setStatusHistoryLogs(new java.util.ArrayList<>());
        StatusHistoryLog log = new StatusHistoryLog();
        log.setParentId(invoice.getId());
        log.setParentType("INVOICE");
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(userId);
        log.setRemarks(remarks);
        invoice.getStatusHistoryLogs().add(log);
    }

    private void logAuditTrail(Invoice invoice, String action, Invoice oldInvoice, Invoice newInvoice, Long userId, String remarks) {
        if (invoice.getAuditTrailLogs() == null) invoice.setAuditTrailLogs(new java.util.ArrayList<>());
        java.util.List<AuditTrailLog> logs = compareInvoicesForAudit(oldInvoice, newInvoice, action, userId, remarks);
        invoice.getAuditTrailLogs().addAll(logs);
    }

    private java.util.List<AuditTrailLog> compareInvoicesForAudit(Invoice oldInv, Invoice newInv, String action, Long userId, String remarks) {
        java.util.List<AuditTrailLog> logs = new java.util.ArrayList<>();
        if (oldInv == null) {
            // Log all fields as created
            java.lang.reflect.Field[] fields = Invoice.class.getDeclaredFields();
            for (java.lang.reflect.Field field : fields) {
                field.setAccessible(true);
                try {
                    Object newValue = field.get(newInv);
                    if (newValue != null) {
                        AuditTrailLog log = new AuditTrailLog();
                        log.setParentId(newInv.getId());
                        log.setParentType("INVOICE");
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
            java.lang.reflect.Field[] fields = Invoice.class.getDeclaredFields();
            for (java.lang.reflect.Field field : fields) {
                field.setAccessible(true);
                try {
                    Object oldValue = field.get(oldInv);
                    Object newValue = field.get(newInv);
                    if (oldValue == null && newValue == null) continue;
                    if (oldValue == null || newValue == null || !oldValue.equals(newValue)) {
                        AuditTrailLog log = new AuditTrailLog();
                        log.setParentId(newInv.getId());
                        log.setParentType("INVOICE");
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