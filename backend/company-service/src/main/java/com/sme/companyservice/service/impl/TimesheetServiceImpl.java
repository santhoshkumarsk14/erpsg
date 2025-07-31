package com.sme.companyservice.service.impl;

import com.sme.companyservice.service.TimesheetService;
import com.sme.companyservice.service.TimesheetServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TimesheetServiceImpl implements TimesheetService {
    @Autowired
    private TimesheetServiceClient timesheetServiceClient;

    @Override
    public int getPendingTimesheets(String companyId) {
        Integer count = timesheetServiceClient.getPendingTimesheets(companyId);
        return count != null ? count : 0;
    }
} 