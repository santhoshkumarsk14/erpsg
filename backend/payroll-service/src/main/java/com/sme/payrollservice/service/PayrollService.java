package com.sme.payrollservice.service;

import com.sme.payrollservice.model.Payroll;
import java.util.List;

public interface PayrollService {
    List<Payroll> getAllPayrollsForCurrentTenant();
    Payroll createPayroll(Payroll payroll);
    Payroll updatePayroll(Long payrollId, Payroll payroll);
    void deletePayroll(Long payrollId);
    byte[] generatePayrollSlipPdf(Long payrollId);
    Object calculateCpfSdl(Long payrollId);
    byte[] generatePayrollExcel(Long payrollId);
} 