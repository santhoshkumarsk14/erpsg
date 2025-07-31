package com.sme.userservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.userservice.model.User;
import com.sme.userservice.repository.UserRepository;
import com.sme.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsersForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return userRepository.findAllByCompanyId(companyId);
    }
} 