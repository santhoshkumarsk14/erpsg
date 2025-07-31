package com.sme.hrservice.controller;

import com.sme.hrservice.model.Attendance;
import com.sme.hrservice.service.AttendanceService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public ApiResponse<List<Attendance>> getAllAttendances() {
        return new ApiResponse<>(true, "Fetched attendances", attendanceService.getAllAttendancesForCurrentTenant());
    }

    @GetMapping("/{id}")
    public ApiResponse<Attendance> getAttendanceById(@PathVariable Long id) {
        return new ApiResponse<>(true, "Fetched attendance", attendanceService.getAttendanceById(id));
    }

    @PostMapping
    public ApiResponse<Attendance> createAttendance(@RequestBody Attendance attendance) {
        return new ApiResponse<>(true, "Created attendance", attendanceService.createAttendance(attendance));
    }

    @PutMapping("/{id}")
    public ApiResponse<Attendance> updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {
        return new ApiResponse<>(true, "Updated attendance", attendanceService.updateAttendance(id, attendance));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return new ApiResponse<>(true, "Deleted attendance", null);
    }
} 