package com.sme.appendixservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.appendixservice.model.Appendix;
import com.sme.appendixservice.repository.AppendixRepository;
import com.sme.appendixservice.service.AppendixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppendixServiceImpl implements AppendixService {
    @Autowired
    private AppendixRepository appendixRepository;

    @Override
    public List<Appendix> getAllAppendicesForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return appendixRepository.findAllByCompanyId(companyId);
    }

    @Override
    public List<Appendix> getAppendicesByTimesheet(Long timesheetId) {
        return appendixRepository.findAllByTimesheetId(timesheetId);
    }

    @Override
    public Appendix createAppendix(Appendix appendix) {
        appendix.setCompanyId(CompanyContext.getCompanyId());
        appendix.setCreatedAt(LocalDateTime.now());
        appendix.setUpdatedAt(LocalDateTime.now());
        appendix.setStatus("INCOMPLETE");
        return appendixRepository.save(appendix);
    }

    @Override
    public Appendix updateAppendix(Long appendixId, Appendix appendix) {
        Appendix existing = appendixRepository.findById(appendixId).orElseThrow();
        existing.setStatus(appendix.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        return appendixRepository.save(existing);
    }

    @Override
    public void deleteAppendix(Long appendixId) {
        appendixRepository.deleteById(appendixId);
    }
} 