package com.sme.companyservice.repository;

import com.sme.companyservice.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
    Optional<Company> findByNameAndCompanyId(String name, String companyId);

    Boolean existsByNameAndCompanyId(String name, String companyId);

    List<Company> findAllByCompanyId(String companyId);

    Optional<Company> findByIdAndCompanyId(String id, String companyId);

    // TODO: Enforce company_id in all queries for multi-tenancy
}