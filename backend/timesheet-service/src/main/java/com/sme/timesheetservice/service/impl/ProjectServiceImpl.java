package com.sme.timesheetservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.timesheetservice.exception.ResourceNotFoundException;
import com.sme.timesheetservice.model.Project;
import com.sme.timesheetservice.model.ProjectStatus;
import com.sme.timesheetservice.payload.request.ProjectRequest;
import com.sme.timesheetservice.repository.ProjectRepository;
import com.sme.timesheetservice.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public List<Project> getAllProjectsForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        if (companyId == null) {
            throw new IllegalStateException("Company context not set");
        }
        return projectRepository.findByCompanyId(companyId);
    }

    @Override
    public Project createProject(Project project) {
        Long companyId = CompanyContext.getCompanyId();
        if (companyId == null) {
            throw new IllegalStateException("Company context not set");
        }
        project.setCompanyId(companyId);
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(String projectId, Project project) {
        Project existing = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        existing.setName(project.getName());
        existing.setDescription(project.getDescription());
        existing.setStartDate(project.getStartDate());
        existing.setEndDate(project.getEndDate());
        existing.setStatus(project.getStatus());
        return projectRepository.save(existing);
    }

    @Override
    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Override
    public List<Project> getProjectsByCompanyId(Long companyId) {
        return projectRepository.findByCompanyId(companyId);
    }

    @Override
    public List<Project> getProjectsByCompanyIdAndStatus(Long companyId, ProjectStatus status) {
        return projectRepository.findByCompanyIdAndStatus(companyId, status);
    }

    @Override
    public void deleteProject(String projectId) {
        Project project = getProjectById(projectId);
        project.setStatus(ProjectStatus.CANCELLED);
        projectRepository.save(project);
    }

    @Override
    public boolean existsByNameAndCompanyId(String name, Long companyId) {
        return projectRepository.existsByNameAndCompanyId(name, companyId);
    }
}