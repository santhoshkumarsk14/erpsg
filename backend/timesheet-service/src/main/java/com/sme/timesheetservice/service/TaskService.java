package com.sme.timesheetservice.service;

import com.sme.timesheetservice.model.Task;
import com.sme.timesheetservice.model.TaskStatus;

import java.util.List;

public interface TaskService {
    List<Task> getAllTasksForCurrentTenant();
    Task getTaskById(String taskId);
    List<Task> getTasksByProjectId(String projectId);
    List<Task> getTasksByProjectIdAndStatus(String projectId, TaskStatus status);
    Task createTask(Task task);
    Task updateTask(String taskId, Task task);
    void deleteTask(String taskId);
}