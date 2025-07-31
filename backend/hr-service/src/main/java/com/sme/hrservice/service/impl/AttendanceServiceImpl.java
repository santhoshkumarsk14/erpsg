package com.sme.hrservice.service.impl;

import com.sme.hrservice.model.Attendance;
import com.sme.hrservice.repository.AttendanceRepository;
import com.sme.hrservice.service.AttendanceService;
import com.sme.shared.CompanyContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public List<Attendance> getAllAttendancesForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return attendanceRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id).orElseThrow();
    }

    @Override
    @Transactional
    public Attendance createAttendance(Attendance attendance) {
        attendance.setCompanyId(CompanyContext.getCompanyId());
        return attendanceRepository.save(attendance);
    }

    @Override
    @Transactional
    public Attendance updateAttendance(Long id, Attendance attendance) {
        Attendance existing = getAttendanceById(id);
        existing.setEmployeeId(attendance.getEmployeeId());
        existing.setProjectId(attendance.getProjectId());
        existing.setDate(attendance.getDate());
        existing.setClockIn(attendance.getClockIn());
        existing.setClockOut(attendance.getClockOut());
        existing.setLocation(attendance.getLocation());
        existing.setMethod(attendance.getMethod());
        existing.setRemarks(attendance.getRemarks());
        return attendanceRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
} 