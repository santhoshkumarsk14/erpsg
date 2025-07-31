package com.sme.companyservice.service.impl;

import com.sme.companyservice.service.UserService;
import com.sme.companyservice.service.UserServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public int getTotalUsers(String companyId) {
        Integer count = userServiceClient.getTotalUsers(companyId);
        return count != null ? count : 0;
    }
} 