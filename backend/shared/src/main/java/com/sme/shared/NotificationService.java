package com.sme.shared;

import java.util.List;

public interface NotificationService {
    Notification sendNotification(Long companyId, Long userId, String type, String message, String channel);
    List<Notification> getNotificationsForCompany(Long companyId);
    List<Notification> getNotificationsForUser(Long userId);
    void markAsRead(Long notificationId);
} 