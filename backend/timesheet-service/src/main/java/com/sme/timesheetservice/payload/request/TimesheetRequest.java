package com.sme.timesheetservice.payload.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TimesheetRequest {

    @NotNull(message = "Task ID is required")
    private String taskId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Hours is required")
    @DecimalMin(value = "0.01", message = "Hours must be greater than 0")
    @DecimalMax(value = "24.00", message = "Hours cannot exceed 24 per day")
    private BigDecimal hours;

    private String description;
}