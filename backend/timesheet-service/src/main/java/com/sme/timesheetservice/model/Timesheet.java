package com.sme.timesheetservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "timesheets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timesheet {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "task_id", nullable = false)
    private String taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "hours", nullable = false, precision = 5, scale = 2)
    private BigDecimal hours;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TimesheetStatus status = TimesheetStatus.PENDING;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "trade")
    private String trade;

    @Column(name = "request_no")
    private String requestNo;

    @Column(name = "item_desc")
    private String itemDesc;

    @Column(name = "module")
    private String module;

    @Column(name = "subcode")
    private String subcode;

    @Column(name = "insp_date")
    private java.time.LocalDate inspDate;

    @Column(name = "start_time")
    private java.time.LocalTime startTime;

    @Column(name = "end_time")
    private java.time.LocalTime endTime;

    @Column(name = "location")
    private String location;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "base_hr")
    private Double baseHr;

    @Column(name = "ot_hr")
    private Double otHr;

    @Column(name = "sat_hr")
    private Double satHr;

    @Column(name = "sun_hr")
    private Double sunHr;

    @Column(name = "total_hr")
    private Double totalHr;

    @Column(name = "remarks")
    private String remarks;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}