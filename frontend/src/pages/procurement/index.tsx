import React from 'react';
import PurchaseOrderList from './PurchaseOrderList';
import PurchaseOrderForm from './PurchaseOrderForm';
import SupplierList from './SupplierList';
import SupplierForm from './SupplierForm';
import InventoryItemList from './InventoryItemList';
import InventoryItemForm from './InventoryItemForm';

const ProcurementModule: React.FC = () => (
  <div>
    <h1>Procurement Management</h1>
    <PurchaseOrderForm />
    <PurchaseOrderList />
    <SupplierForm />
    <SupplierList />
    <InventoryItemForm />
    <InventoryItemList />
  </div>
);

export default ProcurementModule; 