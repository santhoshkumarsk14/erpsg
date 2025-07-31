package com.sme.timesheetservice.service.impl;

import com.sme.timesheetservice.exception.ResourceNotFoundException;
import com.sme.timesheetservice.model.Task;
import com.sme.timesheetservice.model.TaskStatus;
import com.sme.timesheetservice.payload.request.TaskRequest;
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
    public Task createTask(TaskRequest taskRequest) {
        // Verify that the project exists
        projectService.getProjectById(taskRequest.getProjectId());
        
        Task task = new Task();
        task.setName(taskRequest.getName());
        task.setDescription(taskRequest.getDescription());
        task.setProjectId(taskRequest.getProjectId());
        task.setStatus(TaskStatus.PENDING);
        
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(String id, TaskRequest taskRequest) {
        Task task = getTaskById(id);
        
        // If project ID is changing, verify the new project exists
        if (!task.getProjectId().equals(taskRequest.getProjectId())) {
            projectService.getProjectById(taskRequest.getProjectId());
        }
        
        task.setName(taskRequest.getName());
        task.setDescription(taskRequest.getDescription());
        task.setProjectId(taskRequest.getProjectId());
        
        return taskRepository.save(task);
    }

    @Override
    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
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
    public List<Task> getTasksByProjectIds(List<String> projectIds) {
        return taskRepository.findByProjectIdIn(projectIds);
    }

    @Override
    public void deleteTask(String id) {
        Task task = getTaskById(id);
        task.setStatus(TaskStatus.CANCELLED);
        taskRepository.save(task);
    }
}