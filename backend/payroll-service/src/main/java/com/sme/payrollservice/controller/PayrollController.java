package com.sme.payrollservice.controller;

import com.sme.payrollservice.model.Payroll;
import com.sme.payrollservice.service.PayrollService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/payrolls")
public class PayrollController {
    @Autowired
    private PayrollService payrollService;

    @GetMapping
    public ApiResponse<List<Payroll>> getAllPayrolls() {
        return new ApiResponse<>(true, "Fetched payrolls", payrollService.getAllPayrollsForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<Payroll> createPayroll(@RequestBody Payroll payroll) {
        return new ApiResponse<>(true, "Created payroll", payrollService.createPayroll(payroll));
    }

    @PutMapping("/{id}")
    public ApiResponse<Payroll> updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll) {
        return new ApiResponse<>(true, "Updated payroll", payrollService.updatePayroll(id, payroll));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
        return new ApiResponse<>(true, "Deleted payroll", null);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPayrollSlip(@PathVariable Long id) {
        byte[] pdf = payrollService.generatePayrollSlipPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "payslip-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping("/{id}/excel")
    public ResponseEntity<byte[]> exportPayrollExcel(@PathVariable Long id) {
        byte[] xlsx = payrollService.generatePayrollExcel(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "payroll-" + id + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(xlsx);
    }

    @GetMapping("/{id}/cpf-sdl-calc")
    public ApiResponse<?> calculateCpfSdl(@PathVariable Long id) {
        return new ApiResponse<>(true, "CPF/SDL calculated", payrollService.calculateCpfSdl(id));
    }
} 