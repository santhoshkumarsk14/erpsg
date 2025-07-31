package com.sme.timesheetservice.service;

import com.sme.timesheetservice.model.Task;
import java.util.List;

public interface TaskService {
    List<Task> getAllTasksForCurrentTenant();
    Task createTask(Task task);
    Task updateTask(Long taskId, Task task);
    void deleteTask(Long taskId);
}