package com.sme.timesheetservice.repository;

import com.sme.timesheetservice.model.ApprovalLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalLogRepository extends JpaRepository<ApprovalLog, Long> {
    List<ApprovalLog> findAllByTimesheetId(Long timesheetId);
} 