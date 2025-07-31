package com.sme.hrservice.controller;

import com.sme.hrservice.model.Employee;
import com.sme.hrservice.service.EmployeeService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ApiResponse<List<Employee>> getAllEmployees() {
        return new ApiResponse<>(true, "Fetched employees", employeeService.getAllEmployeesForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<Employee> createEmployee(@RequestBody Employee employee) {
        return new ApiResponse<>(true, "Created employee", employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
    public ApiResponse<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return new ApiResponse<>(true, "Updated employee", employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return new ApiResponse<>(true, "Deleted employee", null);
    }
} 