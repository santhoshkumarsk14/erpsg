package com.sme.toolsequipmentservice.service;

import com.sme.toolsequipmentservice.model.Tool;
import java.util.List;

public interface ToolService {
    List<Tool> getAllToolsForCurrentTenant();
    Tool createTool(Tool tool);
    Tool updateTool(Long toolId, Tool tool);
    void deleteTool(Long toolId);
} 