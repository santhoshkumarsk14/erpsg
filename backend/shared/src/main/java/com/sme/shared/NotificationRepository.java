package com.sme.shared;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByCompanyId(Long companyId);
    List<Notification> findAllByUserId(Long userId);
} 