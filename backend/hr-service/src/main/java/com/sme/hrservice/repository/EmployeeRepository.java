package com.sme.hrservice.repository;

import com.sme.hrservice.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findAllByCompanyId(Long companyId);
} 