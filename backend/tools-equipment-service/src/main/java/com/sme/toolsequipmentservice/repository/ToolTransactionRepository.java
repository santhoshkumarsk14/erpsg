package com.sme.toolsequipmentservice.repository;

import com.sme.toolsequipmentservice.model.ToolTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ToolTransactionRepository extends JpaRepository<ToolTransaction, Long> {
    List<ToolTransaction> findAllByCompanyId(Long companyId);
    List<ToolTransaction> findAllByToolId(Long toolId);
} 