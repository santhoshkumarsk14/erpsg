package com.sme.toolsequipmentservice.controller;

import com.sme.toolsequipmentservice.model.ToolTransaction;
import com.sme.toolsequipmentservice.service.ToolTransactionService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tool-transactions")
public class ToolTransactionController {
    @Autowired
    private ToolTransactionService toolTransactionService;

    @GetMapping
    public ApiResponse<List<ToolTransaction>> getAllTransactions() {
        return new ApiResponse<>(true, "Fetched tool transactions", toolTransactionService.getAllTransactionsForCurrentTenant());
    }

    @GetMapping("/tool/{toolId}")
    public ApiResponse<List<ToolTransaction>> getTransactionsByTool(@PathVariable Long toolId) {
        return new ApiResponse<>(true, "Fetched tool transactions", toolTransactionService.getTransactionsByTool(toolId));
    }

    @PostMapping("/checkout")
    public ApiResponse<ToolTransaction> checkOutTool(@RequestParam Long toolId, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Tool checked out", toolTransactionService.checkOutTool(toolId, userId, remarks));
    }

    @PostMapping("/checkin")
    public ApiResponse<ToolTransaction> checkInTool(@RequestParam Long toolId, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Tool checked in", toolTransactionService.checkInTool(toolId, userId, remarks));
    }
} 