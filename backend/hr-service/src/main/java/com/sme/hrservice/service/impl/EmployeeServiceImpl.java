package com.sme.hrservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.hrservice.model.Employee;
import com.sme.hrservice.repository.EmployeeRepository;
import com.sme.hrservice.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAllEmployeesForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return employeeRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Employee createEmployee(Employee employee) {
        employee.setCompanyId(CompanyContext.getCompanyId());
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long employeeId, Employee employee) {
        Employee existing = employeeRepository.findById(employeeId).orElseThrow();
        existing.setName(employee.getName());
        existing.setEmail(employee.getEmail());
        existing.setPosition(employee.getPosition());
        existing.setDepartment(employee.getDepartment());
        existing.setBenefits(employee.getBenefits());
        return employeeRepository.save(existing);
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        employeeRepository.deleteById(employeeId);
    }
} 