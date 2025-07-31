package com.sme.timesheetservice.repository;

import com.sme.timesheetservice.model.Task;
import com.sme.timesheetservice.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    
    List<Task> findByProjectId(String projectId);
    
    List<Task> findByProjectIdAndStatus(String projectId, TaskStatus status);
    
    List<Task> findByProjectIdIn(List<String> projectIds);

    List<Task> findAllByCompanyId(Long companyId);
}