package com.sme.appendixservice.repository;

import com.sme.appendixservice.model.Appendix;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppendixRepository extends JpaRepository<Appendix, Long> {
    List<Appendix> findAllByCompanyId(Long companyId);
    List<Appendix> findAllByTimesheetId(Long timesheetId);
} 