package com.sme.timesheetservice.controller;

import com.sme.timesheetservice.model.Task;
import com.sme.timesheetservice.model.TaskStatus;
import com.sme.timesheetservice.payload.request.TaskRequest;
import com.sme.timesheetservice.service.TaskService;
import com.sme.shared.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/{id}")
    public ApiResponse<Task> getTaskById(@PathVariable String id) {
        return new ApiResponse<>(true, "Fetched task", taskService.getTaskById(id));
    }

    @GetMapping("/project/{projectId}")
    public ApiResponse<List<Task>> getTasksByProjectId(@PathVariable String projectId) {
        return new ApiResponse<>(true, "Fetched tasks", taskService.getTasksByProjectId(projectId));
    }

    @GetMapping("/project/{projectId}/status/{status}")
    public ApiResponse<List<Task>> getTasksByProjectIdAndStatus(
            @PathVariable String projectId, 
            @PathVariable TaskStatus status) {
        return new ApiResponse<>(true, "Fetched tasks", taskService.getTasksByProjectIdAndStatus(projectId, status));
    }

    @PostMapping
    public ApiResponse<Task> createTask(@Valid @RequestBody TaskRequest taskRequest) {
        return new ApiResponse<>(true, "Created task", taskService.createTask(taskRequest));
    }

    @PutMapping("/{id}")
    public ApiResponse<Task> updateTask(@PathVariable String id, @Valid @RequestBody TaskRequest taskRequest) {
        return new ApiResponse<>(true, "Updated task", taskService.updateTask(id, taskRequest));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return new ApiResponse<>(true, "Deleted task", null);
    }
}