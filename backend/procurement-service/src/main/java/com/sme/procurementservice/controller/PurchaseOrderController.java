package com.sme.procurementservice.controller;

import com.sme.procurementservice.model.PurchaseOrder;
import com.sme.procurementservice.service.PurchaseOrderService;
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
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {
    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ApiResponse<List<PurchaseOrder>> getAllPurchaseOrders() {
        return new ApiResponse<>(true, "Fetched purchase orders", purchaseOrderService.getAllPurchaseOrdersForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder po) {
        return new ApiResponse<>(true, "Created purchase order", purchaseOrderService.createPurchaseOrder(po));
    }

    @PutMapping("/{id}")
    public ApiResponse<PurchaseOrder> updatePurchaseOrder(@PathVariable Long id, @RequestBody PurchaseOrder po) {
        return new ApiResponse<>(true, "Updated purchase order", purchaseOrderService.updatePurchaseOrder(id, po));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePurchaseOrder(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        purchaseOrderService.deletePurchaseOrder(id, userId);
        return new ApiResponse<>(true, "Deleted purchase order", null);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportPurchaseOrderPdf(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        purchaseOrderService.logExportAction(id, userId, "EXPORT_PDF");
        byte[] pdf = purchaseOrderService.generatePurchaseOrderPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "po-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping("/{id}/excel")
    public ResponseEntity<byte[]> exportPurchaseOrderExcel(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        purchaseOrderService.logExportAction(id, userId, "EXPORT_EXCEL");
        byte[] xlsx = purchaseOrderService.generatePurchaseOrderExcel(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "po-" + id + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(xlsx);
    }

    // If you have a send endpoint, add logging for send action
    // @PostMapping("/{id}/send")
    // public ApiResponse<Void> sendPurchaseOrder(@PathVariable Long id) {
    //     Long userId = getCurrentUserId();
    //     purchaseOrderService.logExportAction(id, userId, "SEND");
    //     // ... send logic ...
    //     return new ApiResponse<>(true, "Purchase order sent", null);
    // }

    @PostMapping("/{id}/submit-approval")
    public ApiResponse<PurchaseOrder> submitForApproval(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Submitted for approval", purchaseOrderService.submitForApproval(id, userId, remarks));
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<PurchaseOrder> approve(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Purchase order approved", purchaseOrderService.approve(id, userId, remarks));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<PurchaseOrder> reject(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Purchase order rejected", purchaseOrderService.reject(id, userId, remarks));
    }

    @GetMapping("/{id}/approval-logs")
    public ApiResponse<java.util.List<com.sme.shared.ApprovalLog>> getApprovalLogs(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched approval logs", purchaseOrderService.getApprovalLogs(id));
    }

    @GetMapping("/{id}/audit-trail")
    public ApiResponse<java.util.List<com.sme.shared.AuditTrailLog>> getAuditTrail(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched audit trail", purchaseOrderService.getAuditTrailLogs(id));
    }

    @GetMapping("/{id}/status-history")
    public ApiResponse<java.util.List<com.sme.shared.StatusHistoryLog>> getStatusHistory(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched status history", purchaseOrderService.getStatusHistoryLogs(id));
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