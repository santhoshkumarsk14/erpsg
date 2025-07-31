package com.sme.hrservice.service;

import com.sme.hrservice.model.Attendance;
import java.util.List;

public interface AttendanceService {
    List<Attendance> getAllAttendancesForCurrentTenant();
    Attendance getAttendanceById(Long id);
    Attendance createAttendance(Attendance attendance);
    Attendance updateAttendance(Long id, Attendance attendance);
    void deleteAttendance(Long id);
} 