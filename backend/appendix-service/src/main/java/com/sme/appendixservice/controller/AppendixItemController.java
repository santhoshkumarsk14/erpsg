package com.sme.appendixservice.controller;

import com.sme.appendixservice.model.AppendixItem;
import com.sme.appendixservice.service.AppendixItemService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appendix-items")
public class AppendixItemController {
    @Autowired
    private AppendixItemService appendixItemService;

    @GetMapping("/appendix/{appendixId}")
    public ApiResponse<List<AppendixItem>> getItemsByAppendix(@PathVariable Long appendixId) {
        return new ApiResponse<>(true, "Fetched appendix items", appendixItemService.getItemsByAppendix(appendixId));
    }

    @PostMapping
    public ApiResponse<AppendixItem> createItem(@RequestBody AppendixItem item) {
        return new ApiResponse<>(true, "Created appendix item", appendixItemService.createItem(item));
    }

    @PutMapping("/{id}")
    public ApiResponse<AppendixItem> updateItem(@PathVariable Long id, @RequestBody AppendixItem item) {
        return new ApiResponse<>(true, "Updated appendix item", appendixItemService.updateItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteItem(@PathVariable Long id) {
        appendixItemService.deleteItem(id);
        return new ApiResponse<>(true, "Deleted appendix item", null);
    }

    @PutMapping("/bulk/{appendixId}")
    public ApiResponse<List<AppendixItem>> bulkUpdateItems(@PathVariable Long appendixId, @RequestBody List<AppendixItem> items) {
        return new ApiResponse<>(true, "Bulk updated appendix items", appendixItemService.bulkUpdateItems(appendixId, items));
    }
} 