package com.sme.procurementservice.service.impl;

import com.sme.shared.CompanyContext;
import com.sme.procurementservice.model.Supplier;
import com.sme.procurementservice.repository.SupplierRepository;
import com.sme.procurementservice.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public List<Supplier> getAllSuppliersForCurrentTenant() {
        Long companyId = CompanyContext.getCompanyId();
        return supplierRepository.findAllByCompanyId(companyId);
    }

    @Override
    public Supplier createSupplier(Supplier supplier) {
        supplier.setCompanyId(CompanyContext.getCompanyId());
        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier updateSupplier(Long supplierId, Supplier supplier) {
        Supplier existing = supplierRepository.findById(supplierId).orElseThrow();
        existing.setName(supplier.getName());
        existing.setContact(supplier.getContact());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());
        existing.setAddress(supplier.getAddress());
        return supplierRepository.save(existing);
    }

    @Override
    public void deleteSupplier(Long supplierId) {
        supplierRepository.deleteById(supplierId);
    }
} 