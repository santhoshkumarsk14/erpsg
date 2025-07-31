package com.sme.companyservice.service.impl;

import com.sme.companyservice.model.Company;
import com.sme.companyservice.repository.CompanyRepository;
import com.sme.companyservice.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyServiceImpl implements CompanyService {
    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public Optional<Company> getCompanyByIdAndCompanyId(String id, String companyId) {
        return companyRepository.findByIdAndCompanyId(id, companyId);
    }

    @Override
    public List<Company> getAllCompaniesByCompanyId(String companyId) {
        return companyRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }

    @Override
    public boolean existsByNameAndCompanyId(String name, String companyId) {
        return companyRepository.existsByNameAndCompanyId(name, companyId);
    }
} 