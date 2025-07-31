package com.sme.userservice.controllers;

import com.sme.userservice.model.User;
import com.sme.userservice.repository.UserRepository;
import com.sme.userservice.security.services.UserDetailsImpl;
import com.sme.shared.AuditLog;
import com.sme.shared.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('SUPER_ADMIN') or authentication.principal.id == #id")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('SUPER_ADMIN') or authentication.principal.companyId == #companyId")
    public ResponseEntity<?> getCompanyUsers(@PathVariable String companyId) {
        List<User> users = userRepository.findByCompanyId(companyId);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('SUPER_ADMIN') or authentication.principal.id == #id")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        // Only update allowed fields
        user.setName(userDetails.getName());
        user.setDepartment(userDetails.getDepartment());
        user.setPosition(userDetails.getPosition());
        user.setPhone(userDetails.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Only admins can update these fields
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userDetailsImpl.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || 
                               a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        
        if (isAdmin) {
            user.setIsActive(userDetails.getIsActive());
            // Roles can only be updated by admins
            if (userDetails.getRoles() != null && !userDetails.getRoles().isEmpty()) {
                user.setRoles(userDetails.getRoles());
            }
        }
        
        User updatedUser = userRepository.save(user);
        auditLogRepository.save(new AuditLog(null, user.getCompanyId(), user.getId(), "USER", null, "USER_UPDATE", null, null, java.time.LocalDateTime.now()));
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        auditLogRepository.save(new AuditLog(null, user.getCompanyId(), user.getId(), "USER", null, "PASSWORD_CHANGE", null, null, java.time.LocalDateTime.now()));
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/me/enable-2fa")
    public ResponseEntity<?> enable2fa() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setTwoFaEnabled(true);
        userRepository.save(user);
        auditLogRepository.save(new AuditLog(null, user.getCompanyId(), user.getId(), "USER", null, "2FA_ENABLED", null, null, java.time.LocalDateTime.now()));
        return ResponseEntity.ok(Map.of("message", "2FA enabled"));
    }

    @PostMapping("/me/disable-2fa")
    public ResponseEntity<?> disable2fa() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setTwoFaEnabled(false);
        userRepository.save(user);
        auditLogRepository.save(new AuditLog(null, user.getCompanyId(), user.getId(), "USER", null, "2FA_DISABLED", null, null, java.time.LocalDateTime.now()));
        return ResponseEntity.ok(Map.of("message", "2FA disabled"));
    }
}