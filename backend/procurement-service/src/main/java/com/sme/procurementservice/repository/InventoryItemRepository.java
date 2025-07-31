package com.sme.procurementservice.repository;

import com.sme.procurementservice.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findAllByCompanyId(Long companyId);
} 