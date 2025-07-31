package com.sme.leaveservice.service;

import com.sme.leaveservice.model.LeaveRequest;
import java.util.List;

public interface LeaveRequestService {
    List<LeaveRequest> getAllLeaveRequestsForCurrentTenant();
    LeaveRequest createLeaveRequest(LeaveRequest leaveRequest);
    LeaveRequest updateLeaveRequest(Long leaveRequestId, LeaveRequest leaveRequest);
    void deleteLeaveRequest(Long leaveRequestId);
    LeaveRequest approveLeaveRequest(Long leaveRequestId);
    LeaveRequest rejectLeaveRequest(Long leaveRequestId, String reason);
    void updateSupportingDocumentUrl(Long id, String url);
    LeaveRequest getLeaveRequestById(Long id);
} 