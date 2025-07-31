package com.sme.shared;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Notification sendNotification(Long companyId, Long userId, String type, String message, String channel) {
        Notification n = new Notification();
        n.setCompanyId(companyId);
        n.setUserId(userId);
        n.setType(type);
        n.setMessage(message);
        n.setChannel(channel);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(n);
    }

    @Override
    public List<Notification> getNotificationsForCompany(Long companyId) {
        return notificationRepository.findAllByCompanyId(companyId);
    }

    @Override
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findAllByUserId(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId).orElseThrow();
        n.setRead(true);
        n.setSentAt(LocalDateTime.now());
        notificationRepository.save(n);
    }
} 