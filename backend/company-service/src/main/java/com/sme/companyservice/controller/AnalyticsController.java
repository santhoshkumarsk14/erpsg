package com.sme.companyservice.controller;

import com.sme.companyservice.model.ApiResponse;
import com.sme.companyservice.service.UserServiceClient;
import com.sme.companyservice.service.ProjectServiceClient;
import com.sme.companyservice.service.TimesheetServiceClient;
import com.sme.companyservice.service.InvoiceServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @Autowired
    private UserServiceClient userServiceClient;
    @Autowired
    private ProjectServiceClient projectServiceClient;
    @Autowired
    private TimesheetServiceClient timesheetServiceClient;
    @Autowired
    private InvoiceServiceClient invoiceServiceClient;

    @GetMapping("/kpis")
    public ApiResponse<Map<String, Object>> getKPIs(@RequestHeader("X-Company-ID") String companyId) {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalUsers", userServiceClient.getTotalUsers(companyId));
        kpis.put("activeProjects", projectServiceClient.getActiveProjects(companyId));
        kpis.put("pendingTimesheets", timesheetServiceClient.getPendingTimesheets(companyId));
        kpis.put("totalInvoices", invoiceServiceClient.getTotalInvoices(companyId));
        kpis.put("revenue", invoiceServiceClient.getRevenue(companyId));
        return new ApiResponse<>(true, "Fetched KPIs", kpis);
    }
} 