package com.sme.toolsequipmentservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.toolsequipmentservice.model.Tool;
import com.sme.toolsequipmentservice.repository.ToolRepository;
import com.sme.toolsequipmentservice.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;

@Service
public class ToolServiceImpl implements ToolService {
    @Autowired
    private ToolRepository toolRepository;

    @Override
    public List<Tool> getAllToolsForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        List<Tool> tools = toolRepository.findAllByCompanyId(companyId);
        for (Tool tool : tools) {
            if (tool.getMaintenanceDate() != null && tool.getMaintenanceDate().isBefore(LocalDate.now())) {
                tool.setOverdue(true);
            }
            if ("LOST".equalsIgnoreCase(tool.getStatus())) {
                tool.setLost(true);
            }
            if ("MISSING".equalsIgnoreCase(tool.getStatus())) {
                tool.setMissing(true);
            }
        }
        return tools;
    }

    @Override
    public Tool createTool(Tool tool) {
        tool.setCompanyId(CompanyContext.getCompanyId());
        return toolRepository.save(tool);
    }

    @Override
    public Tool updateTool(Long toolId, Tool tool) {
        Tool existing = toolRepository.findById(toolId).orElseThrow();
        existing.setName(tool.getName());
        existing.setSerialNumber(tool.getSerialNumber());
        existing.setStatus(tool.getStatus());
        existing.setLocation(tool.getLocation());
        existing.setAssetTag(tool.getAssetTag());
        existing.setMake(tool.getMake());
        existing.setModel(tool.getModel());
        existing.setPurchaseDate(tool.getPurchaseDate());
        existing.setMaintenanceDate(tool.getMaintenanceDate());
        existing.setImageUrl(tool.getImageUrl());
        existing.setResponsiblePerson(tool.getResponsiblePerson());
        existing.setLastUserId(tool.getLastUserId());
        existing.setOverdue(tool.getOverdue());
        existing.setLost(tool.getLost());
        existing.setMissing(tool.getMissing());
        existing.setMaintenanceSchedule(tool.getMaintenanceSchedule());
        existing.setMaintenanceReminder(tool.getMaintenanceReminder());
        existing.setNotes(tool.getNotes());
        // Overdue logic
        if (tool.getMaintenanceDate() != null && tool.getMaintenanceDate().isBefore(LocalDate.now())) {
            existing.setOverdue(true);
        }
        // Lost/missing logic
        if ("LOST".equalsIgnoreCase(tool.getStatus())) {
            existing.setLost(true);
        }
        if ("MISSING".equalsIgnoreCase(tool.getStatus())) {
            existing.setMissing(true);
        }
        return toolRepository.save(existing);
    }

    @Override
    public void deleteTool(Long toolId) {
        toolRepository.deleteById(toolId);
    }
} 