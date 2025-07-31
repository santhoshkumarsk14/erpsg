package com.sme.procurementservice.service;

import com.sme.procurementservice.model.InventoryItem;
import java.util.List;

public interface InventoryItemService {
    List<InventoryItem> getAllInventoryItemsForCurrentTenant();
    InventoryItem createInventoryItem(InventoryItem item);
    InventoryItem updateInventoryItem(Long itemId, InventoryItem item);
    void deleteInventoryItem(Long itemId);
} 