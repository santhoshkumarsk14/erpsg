package com.sme.appendixservice.service;

import com.sme.appendixservice.model.Appendix;
import java.util.List;

public interface AppendixService {
    List<Appendix> getAllAppendicesForCurrentTenant();
    List<Appendix> getAppendicesByTimesheet(Long timesheetId);
    Appendix createAppendix(Appendix appendix);
    Appendix updateAppendix(Long appendixId, Appendix appendix);
    void deleteAppendix(Long appendixId);
} 