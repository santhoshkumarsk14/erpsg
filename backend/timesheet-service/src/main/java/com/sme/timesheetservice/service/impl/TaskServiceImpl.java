package com.sme.timesheetservice.service.impl;

import com.sme.timesheetservice.context.CompanyContext;
import com.sme.timesheetservice.exception.ResourceNotFoundException;
import com.sme.timesheetservice.model.Task;
import com.sme.timesheetservice.model.TaskStatus;
import com.sme.timesheetservice.repository.TaskRepository;
import com.sme.timesheetservice.service.ProjectService;
import com.sme.timesheetservice.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectService projectService;

    @Override
    public List<Task> getAllTasksForCurrentTenant() {
        return taskRepository.findAllByCompanyId(CompanyContext.getCompanyId());
    }

    @Override
    public Task getTaskById(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    @Override
    public List<Task> getTasksByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getTasksByProjectIdAndStatus(String projectId, TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }

    @Override
    public Task createTask(Task task) {
        projectService.getProjectById(task.getProjectId());
        task.setCompanyId(CompanyContext.getCompanyId());
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(String taskId, Task taskDetails) {
        Task task = getTaskById(taskId);

        if (!task.getProjectId().equals(taskDetails.getProjectId())) {
            projectService.getProjectById(taskDetails.getProjectId());
        }

        task.setName(taskDetails.getName());
        task.setDescription(taskDetails.getDescription());
        task.setProjectId(taskDetails.getProjectId());

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(String taskId) {
        Task task = getTaskById(taskId);
        task.setStatus(TaskStatus.CANCELLED);
        taskRepository.save(task);
    }
}