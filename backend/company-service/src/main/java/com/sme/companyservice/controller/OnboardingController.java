package com.sme.companyservice.controller;

import com.sme.companyservice.model.CompanyOnboardingRequest;
import com.sme.companyservice.model.Company;
import com.sme.companyservice.model.CompanyPlan;
import com.sme.companyservice.repository.CompanyRepository;
import com.sme.companyservice.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.sme.companyservice.security.jwt.UserDetailsImpl;

@RestController
@RequestMapping("/api/company/onboard")
public class OnboardingController {
    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping
    public ApiResponse<Company> onboard(@RequestBody CompanyOnboardingRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        com.sme.companyservice.security.jwt.UserDetailsImpl userDetails = (com.sme.companyservice.security.jwt.UserDetailsImpl) authentication.getPrincipal();
        Company company = new Company();
        company.setName(request.getCompanyName());
        company.setPlan(request.getPlan());
        company.setCompanyId(userDetails.getCompanyId());
        companyRepository.save(company);
        return new ApiResponse<>(true, "Company onboarded", company);
    }
} 