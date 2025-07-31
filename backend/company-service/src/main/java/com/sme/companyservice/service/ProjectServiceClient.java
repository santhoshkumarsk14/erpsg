package com.sme.companyservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "timesheet-service", url = "http://localhost:8086")
public interface ProjectServiceClient {
    @GetMapping("/api/projects/active/count")
    Integer getActiveProjects(@RequestHeader("X-Company-ID") String companyId);
} 