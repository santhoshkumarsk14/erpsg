package com.sme.timesheetservice.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;
}