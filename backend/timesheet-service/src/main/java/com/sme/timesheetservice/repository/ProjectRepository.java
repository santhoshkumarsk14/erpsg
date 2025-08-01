package com.sme.timesheetservice.repository;

import com.sme.timesheetservice.model.Project;
import com.sme.timesheetservice.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    List<Project> findByCompanyId(Long companyId);
    
    List<Project> findByCompanyIdAndStatus(Long companyId, ProjectStatus status);
    
    boolean existsByNameAndCompanyId(String name, Long companyId);
}