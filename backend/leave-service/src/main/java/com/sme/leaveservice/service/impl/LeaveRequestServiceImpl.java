package com.sme.leaveservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.leaveservice.model.LeaveRequest;
import com.sme.leaveservice.repository.LeaveRequestRepository;
import com.sme.leaveservice.service.LeaveRequestService;
import com.sme.shared.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    @Autowired
    @Qualifier("notificationServiceImpl")
    private NotificationService notificationService;

    @Override
    public List<LeaveRequest> getAllLeaveRequestsForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return leaveRequestRepository.findAllByCompanyId(companyId);
    }

    @Override
    @Transactional
    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        leaveRequest.setCompanyId(CompanyContext.getCompanyId());
        leaveRequest.setStatus("PENDING");
        long days = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        leaveRequest.setProRata((double) days);
        leaveRequest.setExpiryDate(leaveRequest.getEndDate().plusYears(1));
        // For demo, set leave balance to 14 - days
        leaveRequest.setLeaveBalance(14.0 - days);
        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    @Transactional
    public LeaveRequest updateLeaveRequest(Long leaveRequestId, LeaveRequest leaveRequest) {
        LeaveRequest existing = leaveRequestRepository.findById(leaveRequestId).orElseThrow();
        existing.setStartDate(leaveRequest.getStartDate());
        existing.setEndDate(leaveRequest.getEndDate());
        existing.setType(leaveRequest.getType());
        existing.setReason(leaveRequest.getReason());
        long days = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        existing.setProRata((double) days);
        existing.setExpiryDate(leaveRequest.getEndDate().plusYears(1));
        existing.setLeaveBalance(14.0 - days);
        return leaveRequestRepository.save(existing);
    }

    @Override
    public void deleteLeaveRequest(Long leaveRequestId) {
        leaveRequestRepository.deleteById(leaveRequestId);
    }

    @Override
    @Transactional
    public LeaveRequest approveLeaveRequest(Long leaveRequestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId).orElseThrow();
        leaveRequest.setStatus("APPROVED");
        // Deduct leave balance (for demo, just set to 0)
        leaveRequest.setLeaveBalance(0.0);
        leaveRequestRepository.save(leaveRequest);
        // Send notification
        notificationService.sendNotification(
            leaveRequest.getCompanyId(),
            leaveRequest.getEmployeeId(),
            "LEAVE_APPROVAL",
            "Your leave request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " has been approved.",
            "INAPP"
        );
        return leaveRequest;
    }

    @Override
    @Transactional
    public LeaveRequest rejectLeaveRequest(Long leaveRequestId, String reason) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId).orElseThrow();
        leaveRequest.setStatus("REJECTED");
        leaveRequest.setReason(reason);
        leaveRequestRepository.save(leaveRequest);
        // Send notification
        notificationService.sendNotification(
            leaveRequest.getCompanyId(),
            leaveRequest.getEmployeeId(),
            "LEAVE_REJECTION",
            "Your leave request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " was rejected. Reason: " + reason,
            "INAPP"
        );
        return leaveRequest;
    }

    @Override
    @Transactional
    public void updateSupportingDocumentUrl(Long id, String url) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id).orElseThrow();
        leaveRequest.setSupportingDocumentUrl(url);
        leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id).orElseThrow();
    }
} 