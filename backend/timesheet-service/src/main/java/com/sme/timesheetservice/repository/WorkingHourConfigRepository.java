package com.sme.timesheetservice.repository;

import com.sme.timesheetservice.model.WorkingHourConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkingHourConfigRepository extends JpaRepository<WorkingHourConfig, Long> {
    WorkingHourConfig findByCompanyId(Long companyId);
} 