package com.sme.toolsequipmentservice.controller;

import com.sme.toolsequipmentservice.model.Tool;
import com.sme.toolsequipmentservice.service.ToolService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tools")
public class ToolController {
    @Autowired
    private ToolService toolService;

    @GetMapping
    public ApiResponse<List<Tool>> getAllTools() {
        return new ApiResponse<>(true, "Fetched tools", toolService.getAllToolsForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<Tool> createTool(@RequestBody Tool tool) {
        return new ApiResponse<>(true, "Created tool", toolService.createTool(tool));
    }

    @PutMapping("/{id}")
    public ApiResponse<Tool> updateTool(@PathVariable Long id, @RequestBody Tool tool) {
        return new ApiResponse<>(true, "Updated tool", toolService.updateTool(id, tool));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTool(@PathVariable Long id) {
        toolService.deleteTool(id);
        return new ApiResponse<>(true, "Deleted tool", null);
    }
} 