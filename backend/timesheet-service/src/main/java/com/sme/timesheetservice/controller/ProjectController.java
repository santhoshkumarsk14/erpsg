package com.sme.timesheetservice.controller;

import com.sme.timesheetservice.model.Project;
import com.sme.timesheetservice.model.ProjectStatus;
import com.sme.timesheetservice.payload.request.ProjectRequest;
import com.sme.timesheetservice.service.ProjectService;
import com.sme.shared.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ApiResponse<List<Project>> getAllProjects() {
        return new ApiResponse<>(true, "Fetched projects", projectService.getAllProjectsForCurrentTenant());
    }

    @GetMapping("/{id}")
    public ApiResponse<Project> getProjectById(@PathVariable String id) {
        return new ApiResponse<>(true, "Fetched project", projectService.getProjectById(id));
    }

    @GetMapping("/company/{companyId}")
    public ApiResponse<List<Project>> getProjectsByCompanyId(@PathVariable String companyId) {
        return new ApiResponse<>(true, "Fetched projects", projectService.getProjectsByCompanyId(Long.parseLong(companyId)));
    }

    @GetMapping("/company/{companyId}/status/{status}")
    public ApiResponse<List<Project>> getProjectsByCompanyIdAndStatus(
            @PathVariable String companyId, 
            @PathVariable ProjectStatus status) {
        return new ApiResponse<>(true, "Fetched projects", projectService.getProjectsByCompanyIdAndStatus(Long.parseLong(companyId), status));
    }

    @PostMapping
    public ApiResponse<Project> createProject(@Valid @RequestBody ProjectRequest projectRequest) {
        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setStartDate(projectRequest.getStartDate());
        project.setEndDate(projectRequest.getEndDate());
        project.setStatus(ProjectStatus.ACTIVE);
        
        return new ApiResponse<>(true, "Created project", projectService.createProject(project));
    }

    @PutMapping("/{id}")
    public ApiResponse<Project> updateProject(@PathVariable String id, @Valid @RequestBody ProjectRequest projectRequest) {
        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setStartDate(projectRequest.getStartDate());
        project.setEndDate(projectRequest.getEndDate());
        
        return new ApiResponse<>(true, "Updated project", projectService.updateProject(id, project));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return new ApiResponse<>(true, "Deleted project", null);
    }
}