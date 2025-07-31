package com.sme.procurementservice.service;

import com.sme.procurementservice.model.Supplier;
import java.util.List;

public interface SupplierService {
    List<Supplier> getAllSuppliersForCurrentTenant();
    Supplier createSupplier(Supplier supplier);
    Supplier updateSupplier(Long supplierId, Supplier supplier);
    void deleteSupplier(Long supplierId);
} 