package com.sme.timesheetservice.config;

import com.sme.timesheetservice.model.Project;
import com.sme.timesheetservice.model.ProjectStatus;
import com.sme.timesheetservice.model.Task;
import com.sme.timesheetservice.model.TaskStatus;
import com.sme.timesheetservice.repository.ProjectRepository;
import com.sme.timesheetservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;

@Configuration
@Profile("!prod")
public class DataInitializer {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Only initialize data if the repositories are empty
            if (projectRepository.count() == 0) {
                // Create sample projects
                Project project1 = new Project();
                project1.setName("Website Redesign");
                project1.setDescription("Redesign the company website with modern UI/UX");
                project1.setCompanyId("company-1"); // Sample company ID
                project1.setStartDate(LocalDate.now().minusDays(30));
                project1.setEndDate(LocalDate.now().plusDays(60));
                project1.setStatus(ProjectStatus.ACTIVE);
                projectRepository.save(project1);

                Project project2 = new Project();
                project2.setName("Mobile App Development");
                project2.setDescription("Develop a mobile app for customer engagement");
                project2.setCompanyId("company-1"); // Sample company ID
                project2.setStartDate(LocalDate.now().minusDays(15));
                project2.setEndDate(LocalDate.now().plusDays(90));
                project2.setStatus(ProjectStatus.ACTIVE);
                projectRepository.save(project2);

                // Create sample tasks for the projects
                Task task1 = new Task();
                task1.setName("Design Homepage");
                task1.setDescription("Create wireframes and design for the homepage");
                task1.setProjectId(project1.getId());
                task1.setStatus(TaskStatus.IN_PROGRESS);
                taskRepository.save(task1);

                Task task2 = new Task();
                task2.setName("Implement Frontend");
                task2.setDescription("Implement the frontend using React");
                task2.setProjectId(project1.getId());
                task2.setStatus(TaskStatus.PENDING);
                taskRepository.save(task2);

                Task task3 = new Task();
                task3.setName("Design App UI");
                task3.setDescription("Design the UI for the mobile app");
                task3.setProjectId(project2.getId());
                task3.setStatus(TaskStatus.IN_PROGRESS);
                taskRepository.save(task3);

                Task task4 = new Task();
                task4.setName("Implement Backend API");
                task4.setDescription("Implement the backend API for the mobile app");
                task4.setProjectId(project2.getId());
                task4.setStatus(TaskStatus.PENDING);
                taskRepository.save(task4);
            }
        };
    }
}