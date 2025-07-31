package com.sme.toolsequipmentservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.toolsequipmentservice.model.Tool;
import com.sme.toolsequipmentservice.model.ToolTransaction;
import com.sme.toolsequipmentservice.repository.ToolRepository;
import com.sme.toolsequipmentservice.repository.ToolTransactionRepository;
import com.sme.toolsequipmentservice.service.ToolTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ToolTransactionServiceImpl implements ToolTransactionService {
    @Autowired
    private ToolTransactionRepository toolTransactionRepository;
    @Autowired
    private ToolRepository toolRepository;

    @Override
    public List<ToolTransaction> getAllTransactionsForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return toolTransactionRepository.findAllByCompanyId(companyId);
    }

    @Override
    public List<ToolTransaction> getTransactionsByTool(Long toolId) {
        return toolTransactionRepository.findAllByToolId(toolId);
    }

    @Override
    public ToolTransaction checkOutTool(Long toolId, Long userId, String remarks) {
        Tool tool = toolRepository.findById(toolId).orElseThrow();
        tool.setStatus("OUT");
        toolRepository.save(tool);
        ToolTransaction tx = new ToolTransaction();
        tx.setToolId(toolId);
        tx.setCompanyId(tool.getCompanyId());
        tx.setUserId(userId);
        tx.setType("CHECKOUT");
        tx.setDate(LocalDateTime.now());
        tx.setRemarks(remarks);
        return toolTransactionRepository.save(tx);
    }

    @Override
    public ToolTransaction checkInTool(Long toolId, Long userId, String remarks) {
        Tool tool = toolRepository.findById(toolId).orElseThrow();
        tool.setStatus("IN");
        toolRepository.save(tool);
        ToolTransaction tx = new ToolTransaction();
        tx.setToolId(toolId);
        tx.setCompanyId(tool.getCompanyId());
        tx.setUserId(userId);
        tx.setType("CHECKIN");
        tx.setDate(LocalDateTime.now());
        tx.setRemarks(remarks);
        return toolTransactionRepository.save(tx);
    }
} 