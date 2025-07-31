import React, { useState } from 'react';
import { createInventoryItem } from '../../services/procurementService';

const InventoryItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [lotNo, setLotNo] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [assetType, setAssetType] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInventoryItem({
      name, sku, quantity, location, lowStockThreshold, expiryDate, batchNo, lotNo, qrCode, barcode, assetType, supplierId
    });
    setMessage('Inventory item created!');
    setName(''); setSku(''); setQuantity(0); setLocation(''); setLowStockThreshold(0); setExpiryDate(''); setBatchNo(''); setLotNo(''); setQrCode(''); setBarcode(''); setAssetType(''); setSupplierId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Inventory Item</h2>
      <div><label>Name</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
      <div><label>SKU</label><input value={sku} onChange={e => setSku(e.target.value)} required /></div>
      <div><label>Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required /></div>
      <div><label>Location</label><input value={location} onChange={e => setLocation(e.target.value)} /></div>
      <div><label>Low Stock Threshold</label><input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} /></div>
      <div><label>Expiry Date</label><input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} /></div>
      <div><label>Batch No</label><input value={batchNo} onChange={e => setBatchNo(e.target.value)} /></div>
      <div><label>Lot No</label><input value={lotNo} onChange={e => setLotNo(e.target.value)} /></div>
      <div><label>QR Code</label><input value={qrCode} onChange={e => setQrCode(e.target.value)} /></div>
      <div><label>Barcode</label><input value={barcode} onChange={e => setBarcode(e.target.value)} /></div>
      <div><label>Asset Type</label><input value={assetType} onChange={e => setAssetType(e.target.value)} /></div>
      <div><label>Supplier ID</label><input value={supplierId} onChange={e => setSupplierId(e.target.value)} /></div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default InventoryItemForm; 