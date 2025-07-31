package com.sme.procurementservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.procurementservice.model.InventoryItem;
import com.sme.procurementservice.repository.InventoryItemRepository;
import com.sme.procurementservice.service.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class InventoryItemServiceImpl implements InventoryItemService {
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Override
    public List<InventoryItem> getAllInventoryItemsForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        List<InventoryItem> items = inventoryItemRepository.findAllByCompanyId(companyId);
        // Set a transient lowStockAlert flag if needed (not persisted)
        for (InventoryItem item : items) {
            if (item.getLowStockThreshold() != null && item.getQuantity() != null && item.getQuantity() <= item.getLowStockThreshold()) {
                // For demo, set assetType to 'LOW_STOCK_ALERT' if low
                item.setAssetType("LOW_STOCK_ALERT");
            }
        }
        return items;
    }

    @Override
    public InventoryItem createInventoryItem(InventoryItem item) {
        item.setCompanyId(CompanyContext.getCompanyId());
        return inventoryItemRepository.save(item);
    }

    @Override
    public InventoryItem updateInventoryItem(Long itemId, InventoryItem item) {
        InventoryItem existing = inventoryItemRepository.findById(itemId).orElseThrow();
        boolean quantityChanged = !existing.getQuantity().equals(item.getQuantity());
        existing.setName(item.getName());
        existing.setSku(item.getSku());
        existing.setQuantity(item.getQuantity());
        existing.setLocation(item.getLocation());
        existing.setLowStockThreshold(item.getLowStockThreshold());
        existing.setExpiryDate(item.getExpiryDate());
        existing.setBatchNo(item.getBatchNo());
        existing.setLotNo(item.getLotNo());
        existing.setQrCode(item.getQrCode());
        existing.setBarcode(item.getBarcode());
        existing.setAssetType(item.getAssetType());
        existing.setSupplierId(item.getSupplierId());
        if (quantityChanged) {
            String log = (existing.getMovementLog() == null ? "" : existing.getMovementLog() + "\n") +
                LocalDateTime.now() + ": Quantity changed from " + existing.getQuantity() + " to " + item.getQuantity();
            existing.setMovementLog(log);
        }
        return inventoryItemRepository.save(existing);
    }

    @Override
    public void deleteInventoryItem(Long itemId) {
        inventoryItemRepository.deleteById(itemId);
    }
} 