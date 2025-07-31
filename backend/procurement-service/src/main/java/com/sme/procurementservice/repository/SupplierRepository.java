package com.sme.procurementservice.repository;

import com.sme.procurementservice.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findAllByCompanyId(Long companyId);
} 