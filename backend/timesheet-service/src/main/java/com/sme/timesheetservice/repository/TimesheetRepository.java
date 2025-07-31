package com.sme.timesheetservice.repository;

import com.sme.timesheetservice.model.Timesheet;
import com.sme.timesheetservice.model.TimesheetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, String> {
    
    List<Timesheet> findByUserId(String userId);
    
    List<Timesheet> findByUserIdAndStatus(String userId, TimesheetStatus status);
    
    List<Timesheet> findByTaskId(String taskId);
    
    List<Timesheet> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    
    List<Timesheet> findByUserIdAndTaskIdAndDate(String userId, String taskId, LocalDate date);
    
    @Query("SELECT t FROM Timesheet t JOIN t.task task JOIN task.project p WHERE p.companyId = :companyId")
    List<Timesheet> findByCompanyId(String companyId);
    
    @Query("SELECT t FROM Timesheet t JOIN t.task task WHERE task.projectId = :projectId")
    List<Timesheet> findByProjectId(String projectId);
}