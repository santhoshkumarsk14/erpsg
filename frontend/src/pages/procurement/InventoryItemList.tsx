import React, { useEffect, useState } from 'react';
import { getInventoryItems, deleteInventoryItem } from '../../services/procurementService';

const InventoryItemList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getInventoryItems();
    setItems(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteInventoryItem(id);
    fetchItems();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Inventory Items</h2>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ color: item.assetType === 'LOW_STOCK_ALERT' ? 'red' : undefined }}>
            {item.name} (SKU: {item.sku}), Qty: {item.quantity}, Location: {item.location},
            Low Stock Threshold: {item.lowStockThreshold}, Expiry: {item.expiryDate}, Batch: {item.batchNo}, Lot: {item.lotNo},
            QR: {item.qrCode}, Barcode: {item.barcode}, Asset Type: {item.assetType}, Supplier: {item.supplierId}
            {item.assetType === 'LOW_STOCK_ALERT' && <strong> [LOW STOCK!]</strong>}
            <br />Movement Log: <pre style={{ display: 'inline' }}>{item.movementLog}</pre>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryItemList; 