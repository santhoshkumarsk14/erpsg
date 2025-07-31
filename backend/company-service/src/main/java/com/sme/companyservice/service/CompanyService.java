package com.sme.companyservice.service;

import com.sme.companyservice.model.Company;
import java.util.List;
import java.util.Optional;

public interface CompanyService {
    Optional<Company> getCompanyByIdAndCompanyId(String id, String companyId);
    List<Company> getAllCompaniesByCompanyId(String companyId);
    Company saveCompany(Company company);
    boolean existsByNameAndCompanyId(String name, String companyId);
} 