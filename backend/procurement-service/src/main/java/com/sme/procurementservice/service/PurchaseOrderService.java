package com.sme.procurementservice.service;

import com.sme.procurementservice.model.PurchaseOrder;
import java.util.List;

public interface PurchaseOrderService {
    List<PurchaseOrder> getAllPurchaseOrdersForCurrentTenant();
    PurchaseOrder createPurchaseOrder(PurchaseOrder po);
    PurchaseOrder updatePurchaseOrder(Long poId, PurchaseOrder po);
    void deletePurchaseOrder(Long poId, Long userId);
    PurchaseOrder convertToInvoice(Long poId);
    byte[] generatePurchaseOrderPdf(Long poId);
    byte[] generatePurchaseOrderExcel(Long poId);
    PurchaseOrder submitForApproval(Long poId, Long userId, String remarks);
    PurchaseOrder approve(Long poId, Long userId, String remarks);
    PurchaseOrder reject(Long poId, Long userId, String remarks);
    java.util.List<com.sme.shared.ApprovalLog> getApprovalLogs(Long poId);
    void logExportAction(Long poId, Long userId, String action);
    java.util.List<com.sme.shared.AuditTrailLog> getAuditTrailLogs(Long poId);
    java.util.List<com.sme.shared.StatusHistoryLog> getStatusHistoryLogs(Long poId);
} 