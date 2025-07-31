package com.sme.toolsequipmentservice.repository;

import com.sme.toolsequipmentservice.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ToolRepository extends JpaRepository<Tool, Long> {
    List<Tool> findAllByCompanyId(Long companyId);
} 