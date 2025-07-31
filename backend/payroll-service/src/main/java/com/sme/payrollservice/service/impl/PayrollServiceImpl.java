package com.sme.payrollservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.payrollservice.model.Payroll;
import com.sme.payrollservice.repository.PayrollRepository;
import com.sme.payrollservice.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.io.ByteArrayOutputStream;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
public class PayrollServiceImpl implements PayrollService {
    @Autowired
    private PayrollRepository payrollRepository;

    @Override
    public List<Payroll> getAllPayrollsForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return payrollRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Payroll createPayroll(Payroll payroll) {
        payroll.setCompanyId(CompanyContext.getCompanyId());
        return payrollRepository.save(payroll);
    }

    @Override
    public Payroll updatePayroll(Long payrollId, Payroll payroll) {
        Payroll existing = payrollRepository.findById(payrollId).orElseThrow();
        existing.setEmployeeId(payroll.getEmployeeId());
        existing.setPeriod(payroll.getPeriod());
        existing.setAmount(payroll.getAmount());
        existing.setStatus(payroll.getStatus());
        existing.setPayslipUrl(payroll.getPayslipUrl());
        return payrollRepository.save(existing);
    }

    @Override
    public void deletePayroll(Long payrollId) {
        payrollRepository.deleteById(payrollId);
    }

    @Override
    public byte[] generatePayrollSlipPdf(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId).orElseThrow();
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Payroll Slip"));
            document.add(new Paragraph("Payroll ID: " + payroll.getId()));
            document.add(new Paragraph("Employee ID: " + payroll.getEmployeeId()));
            document.add(new Paragraph("Period: " + payroll.getPeriod()));
            document.add(new Paragraph("Amount: $" + payroll.getAmount()));
            document.add(new Paragraph("Status: " + payroll.getStatus()));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    @Override
    public byte[] generatePayrollExcel(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId).orElseThrow();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Payroll");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("Payroll ID");
            row.createCell(1).setCellValue(payroll.getId());
            row.createCell(2).setCellValue("Employee ID");
            row.createCell(3).setCellValue(payroll.getEmployeeId());
            row.createCell(4).setCellValue("Period");
            row.createCell(5).setCellValue(payroll.getPeriod());
            row.createCell(6).setCellValue("Amount");
            row.createCell(7).setCellValue(payroll.getAmount());
            row.createCell(8).setCellValue("Status");
            row.createCell(9).setCellValue(payroll.getStatus());
            // ...add more fields as needed...
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel", e);
        }
    }

    @Override
    public Object calculateCpfSdl(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId).orElseThrow();
        double basicPay = payroll.getBasicPay() != null ? payroll.getBasicPay() : 0.0;
        double cpfEmployer = basicPay * 0.17; // Example CPF employer rate
        double cpfEmployee = basicPay * 0.20; // Example CPF employee rate
        double sdl = basicPay * 0.0025; // Example SDL rate
        payroll.setCpfEmployer(cpfEmployer);
        payroll.setCpfEmployee(cpfEmployee);
        payroll.setSdl(sdl);
        payrollRepository.save(payroll);
        return new java.util.HashMap<String, Object>() {{
            put("cpfEmployer", cpfEmployer);
            put("cpfEmployee", cpfEmployee);
            put("sdl", sdl);
        }};
    }
} 