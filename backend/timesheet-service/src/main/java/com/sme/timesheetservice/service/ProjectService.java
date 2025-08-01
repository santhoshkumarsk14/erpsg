package com.sme.timesheetservice.service;

import com.sme.timesheetservice.model.Project;
import com.sme.timesheetservice.model.ProjectStatus;
import java.util.List;

public interface ProjectService {
    List<Project> getAllProjectsForCurrentTenant();
    Project createProject(Project project);
    Project updateProject(String projectId, Project project);
    Project getProjectById(String id);
    List<Project> getProjectsByCompanyId(Long companyId);
    List<Project> getProjectsByCompanyIdAndStatus(Long companyId, ProjectStatus status);
    void deleteProject(String projectId);
    boolean existsByNameAndCompanyId(String name, Long companyId);
}