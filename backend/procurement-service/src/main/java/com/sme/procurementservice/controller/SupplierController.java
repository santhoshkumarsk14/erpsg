package com.sme.procurementservice.controller;

import com.sme.procurementservice.model.Supplier;
import com.sme.procurementservice.service.SupplierService;
import com.sme.shared.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ApiResponse<List<Supplier>> getAllSuppliers() {
        return new ApiResponse<>(true, "Fetched suppliers", supplierService.getAllSuppliersForCurrentTenant());
    }

    @PostMapping
    public ApiResponse<Supplier> createSupplier(@RequestBody Supplier supplier) {
        return new ApiResponse<>(true, "Created supplier", supplierService.createSupplier(supplier));
    }

    @PutMapping("/{id}")
    public ApiResponse<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        return new ApiResponse<>(true, "Updated supplier", supplierService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return new ApiResponse<>(true, "Deleted supplier", null);
    }
} 