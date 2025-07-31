package com.sme.timesheetservice.controller;

import com.sme.timesheetservice.model.Timesheet;
import com.sme.timesheetservice.service.TimesheetService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {
    @Autowired
    private TimesheetService timesheetService;

    @GetMapping
    public ApiResponse<List<Timesheet>> getAllTimesheets() {
        return new ApiResponse<>(true, "Fetched timesheets", timesheetService.getAllTimesheetsForCurrentTenant());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportTimesheetPdf(@PathVariable String id) {
        byte[] pdf = timesheetService.generateTimesheetPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "timesheet-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping("/{id}/excel")
    public ResponseEntity<byte[]> exportTimesheetExcel(@PathVariable String id) {
        byte[] xlsx = timesheetService.generateTimesheetExcel(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "timesheet-" + id + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(xlsx);
    }

    @PostMapping
    public ApiResponse<Timesheet> createTimesheet(@RequestBody Timesheet timesheet) {
        return new ApiResponse<>(true, "Created timesheet", timesheetService.createTimesheet(timesheet));
    }

    @PostMapping("/{id}/submit")
    public ApiResponse<Timesheet> submitTimesheet(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Submitted timesheet", timesheetService.submitTimesheet(id, userId, remarks));
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<Timesheet> approveTimesheet(@PathVariable Long id, @RequestParam Long approverId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Approved timesheet", timesheetService.approveTimesheet(id, approverId, remarks));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<Timesheet> rejectTimesheet(@PathVariable Long id, @RequestParam Long approverId, @RequestParam(required = false) String remarks) {
        return new ApiResponse<>(true, "Rejected timesheet", timesheetService.rejectTimesheet(id, approverId, remarks));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Timesheet> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return new ApiResponse<>(true, "Updated status", timesheetService.updateTimesheetStatus(id, status));
    }
}