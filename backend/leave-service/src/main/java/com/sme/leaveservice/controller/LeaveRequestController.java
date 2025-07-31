package com.sme.leaveservice.controller;

import com.sme.leaveservice.model.LeaveRequest;
import com.sme.leaveservice.service.LeaveRequestService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {
    @Autowired
    private LeaveRequestService leaveRequestService;

    @GetMapping
    public ApiResponse<List<LeaveRequest>> getAllLeaveRequests() {
        return new ApiResponse<>(true, "Fetched leave requests", leaveRequestService.getAllLeaveRequestsForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        return new ApiResponse<>(true, "Created leave request", leaveRequestService.createLeaveRequest(leaveRequest));
    }

    @PutMapping("/{id}")
    public ApiResponse<LeaveRequest> updateLeaveRequest(@PathVariable Long id, @RequestBody LeaveRequest leaveRequest) {
        return new ApiResponse<>(true, "Updated leave request", leaveRequestService.updateLeaveRequest(id, leaveRequest));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteLeaveRequest(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequest(id);
        return new ApiResponse<>(true, "Deleted leave request", null);
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<LeaveRequest> approveLeaveRequest(@PathVariable Long id) {
        return new ApiResponse<>(true, "Approved leave request", leaveRequestService.approveLeaveRequest(id));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<LeaveRequest> rejectLeaveRequest(@PathVariable Long id, @RequestParam String reason) {
        return new ApiResponse<>(true, "Rejected leave request", leaveRequestService.rejectLeaveRequest(id, reason));
    }

    @PostMapping("/{id}/upload-doc")
    public ApiResponse<String> uploadSupportingDocument(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws Exception {
        String uploadDir = "uploads/leaves/" + id;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        File dest = new File(dir, file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(file.getBytes());
        }
        String url = "/" + uploadDir + "/" + file.getOriginalFilename();
        leaveRequestService.updateSupportingDocumentUrl(id, url);
        return new ApiResponse<>(true, "Uploaded", url);
    }

    @GetMapping("/{id}/calendar")
    public ResponseEntity<byte[]> exportLeaveAsCalendar(@PathVariable Long id) throws Exception {
        LeaveRequest leave = leaveRequestService.getLeaveRequestById(id);
        StringBuilder ics = new StringBuilder();
        ics.append("BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n");
        ics.append("SUMMARY:Leave - " + leave.getType() + "\n");
        ics.append("DTSTART:" + leave.getStartDate().toString().replaceAll("-", "") + "\n");
        ics.append("DTEND:" + leave.getEndDate().toString().replaceAll("-", "") + "\n");
        ics.append("DESCRIPTION:" + leave.getReason() + "\n");
        ics.append("END:VEVENT\nEND:VCALENDAR");
        byte[] bytes = ics.toString().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/calendar"));
        headers.setContentDispositionFormData("attachment", "leave-" + id + ".ics");
        return ResponseEntity.ok().headers(headers).body(bytes);
    }
} 