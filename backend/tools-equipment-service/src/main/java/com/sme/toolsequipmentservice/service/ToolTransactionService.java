package com.sme.toolsequipmentservice.service;

import com.sme.toolsequipmentservice.model.ToolTransaction;
import java.util.List;

public interface ToolTransactionService {
    List<ToolTransaction> getAllTransactionsForCurrentTenant();
    List<ToolTransaction> getTransactionsByTool(Long toolId);
    ToolTransaction checkOutTool(Long toolId, Long userId, String remarks);
    ToolTransaction checkInTool(Long toolId, Long userId, String remarks);
} 