package com.sme.leaveservice.repository;

import com.sme.leaveservice.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findAllByCompanyId(Long companyId);
} 