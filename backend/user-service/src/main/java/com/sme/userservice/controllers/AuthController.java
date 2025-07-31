package com.sme.userservice.controllers;

import com.sme.userservice.model.ERole;
import com.sme.userservice.model.Role;
import com.sme.userservice.model.User;
import com.sme.userservice.payload.request.LoginRequest;
import com.sme.userservice.payload.request.SignupRequest;
import com.sme.userservice.payload.response.JwtResponse;
import com.sme.userservice.payload.response.MessageResponse;
import com.sme.userservice.repository.RoleRepository;
import com.sme.userservice.repository.UserRepository;
import com.sme.userservice.security.jwt.JwtUtils;
import com.sme.userservice.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Random;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import com.sme.shared.AuditLog;
import com.sme.shared.AuditLogRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        if (user != null && user.isTwoFaEnabled()) {
            // 2FA enabled: generate code, email it, and require verification
            String code = String.format("%06d", new Random().nextInt(999999));
            user.setTwoFaTempCode(code);
            user.setTwoFaTempExpiry(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            auditLogRepository.save(new AuditLog(null, user != null ? user.getCompanyId() : null, user != null ? (user.getId() != null ? user.getId() : null) : null, "USER", null, "2FA_CODE_SENT", null, null, java.time.LocalDateTime.now()));
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject("Your 2FA Code");
                message.setText("Your 2FA code is: " + code);
                mailSender.send(message);
            }
            return ResponseEntity.ok(new MessageResponse("2FA code sent to your email. Please verify with /api/auth/verify-2fa."));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        auditLogRepository.save(new AuditLog(null, user != null ? user.getCompanyId() : null, user != null ? (user.getId() != null ? user.getId() : null) : null, "USER", null, "LOGIN", null, null, java.time.LocalDateTime.now()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getName(),
                userDetails.getCompanyId() != null ? userDetails.getCompanyId().toString() : null,
                roles));
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2fa(@RequestParam String username, @RequestParam String code) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || !user.isTwoFaEnabled()) {
            return ResponseEntity.badRequest().body(new MessageResponse("2FA not enabled or user not found."));
        }
        if (user.getTwoFaTempCode() == null || user.getTwoFaTempExpiry() == null ||
            !user.getTwoFaTempCode().equals(code) || user.getTwoFaTempExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired 2FA code."));
        }
        // Clear temp code after use
        user.setTwoFaTempCode(null);
        user.setTwoFaTempExpiry(null);
        userRepository.save(user);
        auditLogRepository.save(new AuditLog(null, user != null ? user.getCompanyId() : null, user != null ? (user.getId() != null ? user.getId() : null) : null, "USER", null, "2FA_VERIFIED", null, null, java.time.LocalDateTime.now()));
        // Authenticate and return JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, "2fa-bypass")); // password is not checked here
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getName(),
                userDetails.getCompanyId() != null ? userDetails.getCompanyId().toString() : null,
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setName(signUpRequest.getName());
        user.setCompanyId(signUpRequest.getCompanyId());
        user.setDepartment(signUpRequest.getDepartment());
        user.setPosition(signUpRequest.getPosition());
        user.setPhone(signUpRequest.getPhone());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "manager":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MANAGER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    case "superadmin":
                        Role superAdminRole = roleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(superAdminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        auditLogRepository.save(new AuditLog(null, user != null ? user.getCompanyId() : null, user != null ? (user.getId() != null ? user.getId() : null) : null, "USER", null, "REGISTER", null, null, java.time.LocalDateTime.now()));

        // After successful registration, authenticate the user and return JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signUpRequest.getUsername(), signUpRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> userRoles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getName(),
                userDetails.getCompanyId() != null ? userDetails.getCompanyId().toString() : null,
                userRoles));
    }
}