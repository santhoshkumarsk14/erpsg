package com.sme.shared;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private Long userId;
    private String type;
    private String message;
    private String channel; // EMAIL, SMS, INAPP, WHATSAPP
    private Boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;

    // Getters and setters
    // ...
} 