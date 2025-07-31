package com.sme.appendixservice.controller;

import com.sme.appendixservice.model.Appendix;
import com.sme.appendixservice.service.AppendixService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appendices")
public class AppendixController {
    @Autowired
    private AppendixService appendixService;

    @GetMapping
    public ApiResponse<List<Appendix>> getAllAppendices() {
        return new ApiResponse<>(true, "Fetched appendices", appendixService.getAllAppendicesForCurrentTenant());
    }

    @GetMapping("/timesheet/{timesheetId}")
    public ApiResponse<List<Appendix>> getAppendicesByTimesheet(@PathVariable Long timesheetId) {
        return new ApiResponse<>(true, "Fetched appendices by timesheet", appendixService.getAppendicesByTimesheet(timesheetId));
    }

    @PostMapping
    public ApiResponse<Appendix> createAppendix(@RequestBody Appendix appendix) {
        return new ApiResponse<>(true, "Created appendix", appendixService.createAppendix(appendix));
    }

    @PutMapping("/{id}")
    public ApiResponse<Appendix> updateAppendix(@PathVariable Long id, @RequestBody Appendix appendix) {
        return new ApiResponse<>(true, "Updated appendix", appendixService.updateAppendix(id, appendix));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAppendix(@PathVariable Long id) {
        appendixService.deleteAppendix(id);
        return new ApiResponse<>(true, "Deleted appendix", null);
    }
} 