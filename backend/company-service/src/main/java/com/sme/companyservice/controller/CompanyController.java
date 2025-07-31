package com.sme.companyservice.controller;

import com.sme.companyservice.model.Company;
import com.sme.companyservice.repository.CompanyRepository;
import com.sme.companyservice.security.jwt.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or authentication.principal.companyId == #id")
    public ResponseEntity<?> getCompany(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isSuperAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        Company company;
        if (isSuperAdmin) {
            company = companyRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        } else {
            company = companyRepository.findByIdAndCompanyId(id, userDetails.getCompanyId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        }
        return ResponseEntity.ok(company);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Company company = companyRepository.findAllByCompanyId(userDetails.getCompanyId())
                .stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        return ResponseEntity.ok(company);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company companyRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isSuperAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        boolean nameExists = isSuperAdmin
                ? companyRepository.existsByNameAndCompanyId(companyRequest.getName(), companyRequest.getCompanyId())
                : companyRepository.existsByNameAndCompanyId(companyRequest.getName(), userDetails.getCompanyId());
        if (nameExists) {
            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap("message", "Error: Company name is already taken!"));
        }
        Company company = new Company();
        company.setId(UUID.randomUUID().toString());
        company.setName(companyRequest.getName());
        company.setIndustry(companyRequest.getIndustry());
        company.setEmployeeCount(companyRequest.getEmployeeCount());
        company.setAddress(companyRequest.getAddress());
        company.setCity(companyRequest.getCity());
        company.setState(companyRequest.getState());
        company.setCountry(companyRequest.getCountry());
        company.setPostalCode(companyRequest.getPostalCode());
        company.setPhone(companyRequest.getPhone());
        company.setWebsite(companyRequest.getWebsite());
        company.setLogo(companyRequest.getLogo());
        company.setSubscriptionPlan(companyRequest.getSubscriptionPlan());
        company.setSubscriptionStatus(companyRequest.getSubscriptionStatus());
        company.setSubscriptionExpiry(companyRequest.getSubscriptionExpiry());
        company.setCreatedAt(LocalDateTime.now());
        company.setUpdatedAt(LocalDateTime.now());
        if (isSuperAdmin) {
            company.setCompanyId(companyRequest.getCompanyId());
        } else {
            company.setCompanyId(userDetails.getCompanyId());
        }
        Company savedCompany = companyRepository.save(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCompany);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or authentication.principal.companyId == #id")
    public ResponseEntity<?> updateCompany(@PathVariable String id, @Valid @RequestBody Company companyDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isSuperAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        Company company = isSuperAdmin
                ? companyRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"))
                : companyRepository.findByIdAndCompanyId(id, userDetails.getCompanyId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        boolean nameExists = isSuperAdmin
                ? (!company.getName().equals(companyDetails.getName()) && companyRepository.existsByNameAndCompanyId(companyDetails.getName(), companyDetails.getCompanyId()))
                : (!company.getName().equals(companyDetails.getName()) && companyRepository.existsByNameAndCompanyId(companyDetails.getName(), userDetails.getCompanyId()));
        if (nameExists) {
            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap("message", "Error: Company name is already taken!"));
        }
        company.setName(companyDetails.getName());
        company.setIndustry(companyDetails.getIndustry());
        company.setEmployeeCount(companyDetails.getEmployeeCount());
        company.setAddress(companyDetails.getAddress());
        company.setCity(companyDetails.getCity());
        company.setState(companyDetails.getState());
        company.setCountry(companyDetails.getCountry());
        company.setPostalCode(companyDetails.getPostalCode());
        company.setPhone(companyDetails.getPhone());
        company.setWebsite(companyDetails.getWebsite());
        company.setLogo(companyDetails.getLogo());
        if (isSuperAdmin) {
            company.setSubscriptionPlan(companyDetails.getSubscriptionPlan());
            company.setSubscriptionStatus(companyDetails.getSubscriptionStatus());
            company.setSubscriptionExpiry(companyDetails.getSubscriptionExpiry());
            company.setCompanyId(companyDetails.getCompanyId());
        }
        company.setUpdatedAt(LocalDateTime.now());
        Company updatedCompany = companyRepository.save(company);
        return ResponseEntity.ok(updatedCompany);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return ResponseEntity.ok(companies);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable String id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        companyRepository.delete(company);
        return ResponseEntity.ok(Collections.singletonMap("message", "Company deleted successfully"));
    }
}