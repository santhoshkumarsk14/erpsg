package com.sme.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 120)
    private String password;

    private Long companyId;
    private String role; // e.g., ADMIN, USER

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Size(max = 50)
    private String department;

    @Size(max = 50)
    private String position;

    @Size(max = 20)
    private String phone;

    private boolean isActive = true;
    private boolean twoFaEnabled = false;
    private String twoFaSecret;
    private String twoFaTempCode;
    private LocalDateTime twoFaTempExpiry;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isTwoFaEnabled() { return twoFaEnabled; }
    public void setTwoFaEnabled(boolean twoFaEnabled) { this.twoFaEnabled = twoFaEnabled; }
    public String getTwoFaSecret() { return twoFaSecret; }
    public void setTwoFaSecret(String twoFaSecret) { this.twoFaSecret = twoFaSecret; }
    public String getTwoFaTempCode() { return twoFaTempCode; }
    public void setTwoFaTempCode(String twoFaTempCode) { this.twoFaTempCode = twoFaTempCode; }
    public LocalDateTime getTwoFaTempExpiry() { return twoFaTempExpiry; }
    public void setTwoFaTempExpiry(LocalDateTime twoFaTempExpiry) { this.twoFaTempExpiry = twoFaTempExpiry; }
    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
}