package com.sme.userservice.service;

import com.sme.userservice.model.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsersForCurrentTenant();
} 