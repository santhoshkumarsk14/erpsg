package com.sme.procurementservice.controller;

import com.sme.procurementservice.model.InventoryItem;
import com.sme.procurementservice.service.InventoryItemService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory-items")
public class InventoryItemController {
    @Autowired
    private InventoryItemService inventoryItemService;

    @GetMapping
    public ApiResponse<List<InventoryItem>> getAllInventoryItems() {
        return new ApiResponse<>(true, "Fetched inventory items", inventoryItemService.getAllInventoryItemsForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<InventoryItem> createInventoryItem(@RequestBody InventoryItem item) {
        return new ApiResponse<>(true, "Created inventory item", inventoryItemService.createInventoryItem(item));
    }

    @PutMapping("/{id}")
    public ApiResponse<InventoryItem> updateInventoryItem(@PathVariable Long id, @RequestBody InventoryItem item) {
        return new ApiResponse<>(true, "Updated inventory item", inventoryItemService.updateInventoryItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteInventoryItem(@PathVariable Long id) {
        inventoryItemService.deleteInventoryItem(id);
        return new ApiResponse<>(true, "Deleted inventory item", null);
    }
} 