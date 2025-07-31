package com.sme.companyservice.service.impl;

import com.sme.companyservice.service.ProjectService;
import com.sme.companyservice.service.ProjectServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectServiceClient projectServiceClient;

    @Override
    public int getActiveProjects(String companyId) {
        Integer count = projectServiceClient.getActiveProjects(companyId);
        return count != null ? count : 0;
    }
} 