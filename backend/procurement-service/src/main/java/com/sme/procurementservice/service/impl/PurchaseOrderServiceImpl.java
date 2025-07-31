package com.sme.procurementservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.procurementservice.model.PurchaseOrder;
import com.sme.procurementservice.repository.PurchaseOrderRepository;
import com.sme.procurementservice.service.PurchaseOrderService;
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
public class PurchaseOrderServiceImpl implements PurchaseOrderService {
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public List<PurchaseOrder> getAllPurchaseOrdersForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return purchaseOrderRepository.findAllByCompanyId(companyId);
    }

    @Override
    public PurchaseOrder createPurchaseOrder(PurchaseOrder po) {
        Long companyId = CompanyContext.getCompanyId();
        po.setCompanyId(companyId);
        po.setPoNumber(generatePoNumber(companyId));
        po.setIssueDate(LocalDate.now());
        po.setStatus("DRAFT");
        calculatePoTotals(po);
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        logStatusChange(saved, null, "DRAFT", null, "Created");
        logAuditTrail(saved, "CREATE", null, saved, null, "Created");
        return saved;
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(Long poId, PurchaseOrder po) {
        PurchaseOrder existing = purchaseOrderRepository.findById(poId).orElseThrow();
        String oldStatus = existing.getStatus();
        PurchaseOrder oldCopy = new PurchaseOrder();
        org.springframework.beans.BeanUtils.copyProperties(existing, oldCopy);
        existing.setSupplier(po.getSupplier());
        existing.setAmount(po.getAmount());
        existing.setStatus(po.getStatus());
        existing.setPdfUrl(po.getPdfUrl());
        existing.setLineItems(po.getLineItems());
        calculatePoTotals(existing);
        PurchaseOrder saved = purchaseOrderRepository.save(existing);
        if (!oldStatus.equals(saved.getStatus())) {
            logStatusChange(saved, oldStatus, saved.getStatus(), null, "Status updated");
        }
        logAuditTrail(saved, "UPDATE", oldCopy, saved, null, "Updated");
        return saved;
    }

    @Override
    public void deletePurchaseOrder(Long poId, Long userId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        logAuditTrail(po, "DELETE", po, po, userId, "Deleted");
        purchaseOrderRepository.deleteById(poId);
    }

    @Override
    @Transactional
    public PurchaseOrder convertToInvoice(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        Invoice invoice = new Invoice();
        invoice.setCompanyId(po.getCompanyId());
        invoice.setInvoiceNumber(generateInvoiceNumber(po.getCompanyId()));
        invoice.setIssueDate(java.time.LocalDate.now());
        invoice.setDueDate(po.getIssueDate());
        invoice.setClient(po.getBuyerDetails());
        invoice.setAmount(po.getGrandTotal());
        invoice.setSubtotal(po.getSubtotal());
        invoice.setDiscount(po.getDiscount());
        invoice.setTax(po.getTax());
        invoice.setShipping(po.getShipping());
        invoice.setGrandTotal(po.getGrandTotal());
        invoice.setCurrency(po.getCurrency());
        invoice.setPaymentTerms(po.getPaymentTerms());
        invoice.setPaymentInstructions(po.getPaymentInstructions());
        invoice.setNotes(po.getNotes());
        invoice.setAttachments(po.getAttachments());
        invoice.setSellerDetails(po.getSellerDetails());
        invoice.setBuyerDetails(po.getBuyerDetails());
        invoice.setStatusHistory(po.getStatusHistory());
        invoice.setApprovalWorkflow(po.getApprovalWorkflow());
        invoice.setRecurring(po.getRecurring());
        invoice.setMultiLanguageSupport(po.getMultiLanguageSupport());
        invoice.setLineItems(new java.util.ArrayList<>());
        for (LineItem item : po.getLineItems()) {
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
        po.setStatus("CONVERTED");
        // Log in AuditLog (pseudo-code, implement as needed)
        // auditLogRepository.save(new AuditLog(...));
        return purchaseOrderRepository.save(po);
    }

    @Override
    public byte[] generatePurchaseOrderPdf(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Purchase Order"));
            document.add(new Paragraph("PO Number: " + po.getPoNumber()));
            document.add(new Paragraph("Supplier: " + po.getSupplier()));
            document.add(new Paragraph("Amount: $" + po.getAmount()));
            document.add(new Paragraph("Status: " + po.getStatus()));
            document.add(new Paragraph("Issue Date: " + po.getIssueDate()));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    @Override
    public byte[] generatePurchaseOrderExcel(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Purchase Order");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("PO Number");
            row.createCell(1).setCellValue(po.getPoNumber());
            row.createCell(2).setCellValue("Supplier");
            row.createCell(3).setCellValue(po.getSupplier());
            row.createCell(4).setCellValue("Amount");
            row.createCell(5).setCellValue(po.getAmount());
            row.createCell(6).setCellValue("Status");
            row.createCell(7).setCellValue(po.getStatus());
            row.createCell(8).setCellValue("Issue Date");
            row.createCell(9).setCellValue(po.getIssueDate() != null ? po.getIssueDate().toString() : "");
            // ...add more fields as needed...
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel", e);
        }
    }

    @Override
    public PurchaseOrder submitForApproval(Long poId, Long userId, String remarks) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        String oldStatus = po.getStatus();
        po.setStatus("PENDING_APPROVAL");
        logStatusChange(po, oldStatus, "PENDING_APPROVAL", userId, remarks);
        logAuditTrail(po, "SUBMIT_FOR_APPROVAL", po, po, userId, remarks);
        if (po.getApprovalLogs() == null) po.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(poId);
        log.setParentType("PO");
        log.setApproverId(userId);
        log.setAction("SUBMITTED");
        log.setRemarks(remarks);
        po.getApprovalLogs().add(log);
        return purchaseOrderRepository.save(po);
    }

    @Override
    public PurchaseOrder approve(Long poId, Long userId, String remarks) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        String oldStatus = po.getStatus();
        po.setStatus("APPROVED");
        logStatusChange(po, oldStatus, "APPROVED", userId, remarks);
        logAuditTrail(po, "APPROVE", po, po, userId, remarks);
        if (po.getApprovalLogs() == null) po.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(poId);
        log.setParentType("PO");
        log.setApproverId(userId);
        log.setAction("APPROVED");
        log.setRemarks(remarks);
        po.getApprovalLogs().add(log);
        return purchaseOrderRepository.save(po);
    }

    @Override
    public PurchaseOrder reject(Long poId, Long userId, String remarks) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        String oldStatus = po.getStatus();
        po.setStatus("REJECTED");
        logStatusChange(po, oldStatus, "REJECTED", userId, remarks);
        logAuditTrail(po, "REJECT", po, po, userId, remarks);
        if (po.getApprovalLogs() == null) po.setApprovalLogs(new java.util.ArrayList<>());
        ApprovalLog log = new ApprovalLog();
        log.setParentId(poId);
        log.setParentType("PO");
        log.setApproverId(userId);
        log.setAction("REJECTED");
        log.setRemarks(remarks);
        po.getApprovalLogs().add(log);
        return purchaseOrderRepository.save(po);
    }

    @Override
    public java.util.List<ApprovalLog> getApprovalLogs(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        return po.getApprovalLogs() != null ? po.getApprovalLogs() : java.util.Collections.emptyList();
    }

    @Override
    public void logExportAction(Long poId, Long userId, String action) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        logAuditTrail(po, action, po, po, userId, action);
        purchaseOrderRepository.save(po);
    }

    @Override
    public java.util.List<AuditTrailLog> getAuditTrailLogs(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        return po.getAuditTrailLogs() != null ? po.getAuditTrailLogs() : java.util.Collections.emptyList();
    }

    @Override
    public java.util.List<StatusHistoryLog> getStatusHistoryLogs(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow();
        return po.getStatusHistoryLogs() != null ? po.getStatusHistoryLogs() : java.util.Collections.emptyList();
    }

    private String generatePoNumber(Long companyId) {
        PurchaseOrder last = purchaseOrderRepository.findTopByCompanyIdOrderByIdDesc(companyId);
        int next = 1;
        String prefix = "PO-" + LocalDate.now().getYear() + String.format("%02d", LocalDate.now().getMonthValue());
        if (last != null && last.getPoNumber() != null && last.getPoNumber().startsWith(prefix)) {
            String[] parts = last.getPoNumber().split("-");
            String seq = parts[2];
            next = Integer.parseInt(seq) + 1;
        }
        return prefix + "-" + String.format("%03d", next);
    }

    private String generateInvoiceNumber(Long companyId) {
        Invoice last = invoiceRepository.findTopByCompanyIdOrderByIdDesc(companyId);
        int next = 1;
        String prefix = "INV-" + java.time.LocalDate.now().getYear() + String.format("%02d", java.time.LocalDate.now().getMonthValue());
        if (last != null && last.getInvoiceNumber() != null && last.getInvoiceNumber().startsWith(prefix)) {
            String[] parts = last.getInvoiceNumber().split("-");
            String seq = parts[2];
            next = Integer.parseInt(seq) + 1;
        }
        return prefix + "-" + String.format("%03d", next);
    }

    private void calculatePoTotals(PurchaseOrder po) {
        List<LineItem> lineItems = po.getLineItems();
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
        BigDecimal headerDiscount = po.getDiscount() != null ? BigDecimal.valueOf(po.getDiscount()) : BigDecimal.ZERO;
        totalDiscount = totalDiscount.add(headerDiscount);
        BigDecimal shipping = po.getShipping() != null ? BigDecimal.valueOf(po.getShipping()) : BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.subtract(totalDiscount).add(totalTax).add(shipping);
        po.setSubtotal(subtotal.doubleValue());
        po.setTax(totalTax.doubleValue());
        po.setDiscount(totalDiscount.doubleValue());
        po.setShipping(shipping.doubleValue());
        po.setGrandTotal(grandTotal.doubleValue());
    }

    private void logStatusChange(PurchaseOrder po, String oldStatus, String newStatus, Long userId, String remarks) {
        if (po.getStatusHistoryLogs() == null) po.setStatusHistoryLogs(new java.util.ArrayList<>());
        StatusHistoryLog log = new StatusHistoryLog();
        log.setParentId(po.getId());
        log.setParentType("PO");
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(userId);
        log.setRemarks(remarks);
        po.getStatusHistoryLogs().add(log);
    }

    private void logAuditTrail(PurchaseOrder po, String action, PurchaseOrder oldPo, PurchaseOrder newPo, Long userId, String remarks) {
        if (po.getAuditTrailLogs() == null) po.setAuditTrailLogs(new java.util.ArrayList<>());
        java.util.List<AuditTrailLog> logs = comparePOsForAudit(oldPo, newPo, action, userId, remarks);
        po.getAuditTrailLogs().addAll(logs);
    }

    private java.util.List<AuditTrailLog> comparePOsForAudit(PurchaseOrder oldPO, PurchaseOrder newPO, String action, Long userId, String remarks) {
        java.util.List<AuditTrailLog> logs = new java.util.ArrayList<>();
        if (oldPO == null) {
            java.lang.reflect.Field[] fields = PurchaseOrder.class.getDeclaredFields();
            for (java.lang.reflect.Field field : fields) {
                field.setAccessible(true);
                try {
                    Object newValue = field.get(newPO);
                    if (newValue != null) {
                        AuditTrailLog log = new AuditTrailLog();
                        log.setParentId(newPO.getId());
                        log.setParentType("PO");
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
            java.lang.reflect.Field[] fields = PurchaseOrder.class.getDeclaredFields();
            for (java.lang.reflect.Field field : fields) {
                field.setAccessible(true);
                try {
                    Object oldValue = field.get(oldPO);
                    Object newValue = field.get(newPO);
                    if (oldValue == null && newValue == null) continue;
                    if (oldValue == null || newValue == null || !oldValue.equals(newValue)) {
                        AuditTrailLog log = new AuditTrailLog();
                        log.setParentId(newPO.getId());
                        log.setParentType("PO");
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