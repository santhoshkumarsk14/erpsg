package com.sme.timesheetservice.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Task name is required")
    private String name;

    private String description;

    @NotNull(message = "Project ID is required")
    private String projectId;
}