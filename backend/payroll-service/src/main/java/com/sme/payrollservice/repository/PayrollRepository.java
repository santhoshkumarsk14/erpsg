package com.sme.payrollservice.repository;

import com.sme.payrollservice.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findAllByCompanyId(Long companyId);
} 