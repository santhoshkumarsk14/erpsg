package com.sme.shared;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "line_items")
public class LineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "parent_id", nullable = false)
    private Long parentId; // Invoice, Quote, or PO ID
    
    @Column(name = "parent_type", nullable = false)
    private String parentType; // 'INVOICE', 'QUOTE', 'PO'
    
    @Column(name = "description", nullable = false, length = 1000)
    private String description;
    
    @Column(name = "sku", length = 100)
    private String sku; // SKU/Part No.
    
    @Column(name = "quantity", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;
    
    @Column(name = "unit_of_measure", length = 50)
    private String unitOfMeasure;
    
    @Column(name = "unit_price", nullable = false, precision = 15, scale = 4)
    private BigDecimal unitPrice;
    
    @Column(name = "discount", precision = 15, scale = 4)
    private BigDecimal discount = BigDecimal.ZERO;
    
    @Column(name = "discount_type", length = 20)
    private String discountType = "PERCENT"; // 'AMOUNT' or 'PERCENT'
    
    @Column(name = "tax_code", length = 20)
    private String taxCode = "GST"; // Tax code for Singapore GST
    
    @Column(name = "tax_rate", precision = 5, scale = 4)
    private BigDecimal taxRate = new BigDecimal("0.09"); // 9% GST default
    
    @Column(name = "tax_exempt")
    private Boolean taxExempt = false;
    
    @Column(name = "line_subtotal", precision = 15, scale = 4)
    private BigDecimal lineSubtotal;
    
    @Column(name = "line_tax_amount", precision = 15, scale = 4)
    private BigDecimal lineTaxAmount;
    
    @Column(name = "line_total", precision = 15, scale = 4)
    private BigDecimal lineTotal;
    
    @Column(name = "notes", length = 2000)
    private String notes;
    
    // Audit fields
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    // Constructors
    public LineItem() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Auto-calculation methods
    @PrePersist
    @PreUpdate
    public void calculateAmounts() {
        if (quantity != null && unitPrice != null) {
            // Calculate subtotal
            lineSubtotal = quantity.multiply(unitPrice).setScale(4, RoundingMode.HALF_UP);
            
            // Apply discount
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
                if ("PERCENT".equals(discountType)) {
                    discountAmount = lineSubtotal.multiply(discount.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP));
                } else {
                    discountAmount = discount;
                }
            }
            
            BigDecimal subtotalAfterDiscount = lineSubtotal.subtract(discountAmount);
            
            // Calculate tax
            if (taxExempt != null && taxExempt) {
                lineTaxAmount = BigDecimal.ZERO;
            } else {
                lineTaxAmount = subtotalAfterDiscount.multiply(taxRate).setScale(4, RoundingMode.HALF_UP);
            }
            
            // Calculate line total
            lineTotal = subtotalAfterDiscount.add(lineTaxAmount);
        }
        
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    
    public String getParentType() { return parentType; }
    public void setParentType(String parentType) { this.parentType = parentType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    
    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
    
    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }
    
    public String getTaxCode() { return taxCode; }
    public void setTaxCode(String taxCode) { this.taxCode = taxCode; }
    
    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }
    
    public Boolean getTaxExempt() { return taxExempt; }
    public void setTaxExempt(Boolean taxExempt) { this.taxExempt = taxExempt; }
    
    public BigDecimal getLineSubtotal() { return lineSubtotal; }
    public void setLineSubtotal(BigDecimal lineSubtotal) { this.lineSubtotal = lineSubtotal; }
    
    public BigDecimal getLineTaxAmount() { return lineTaxAmount; }
    public void setLineTaxAmount(BigDecimal lineTaxAmount) { this.lineTaxAmount = lineTaxAmount; }
    
    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}