package com.sme.procurementservice.repository;

import com.sme.procurementservice.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findAllByCompanyId(Long companyId);
    PurchaseOrder findTopByCompanyIdOrderByIdDesc(Long companyId);
} 