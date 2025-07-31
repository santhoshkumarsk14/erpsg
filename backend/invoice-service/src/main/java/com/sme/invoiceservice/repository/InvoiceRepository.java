package com.sme.invoiceservice.repository;

import com.sme.invoiceservice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findAllByCompanyId(Long companyId);
    Invoice findTopByCompanyIdOrderByIdDesc(Long companyId);
} 