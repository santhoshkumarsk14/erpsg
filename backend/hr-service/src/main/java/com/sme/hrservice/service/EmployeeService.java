package com.sme.hrservice.service;

import com.sme.hrservice.model.Employee;
import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployeesForCurrentTenant();
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long employeeId, Employee employee);
    void deleteEmployee(Long employeeId);
} 