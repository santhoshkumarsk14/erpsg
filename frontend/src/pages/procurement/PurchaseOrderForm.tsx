import React, { useState } from 'react';
import { createPurchaseOrder } from '../../services/procurementService';

const PurchaseOrderForm: React.FC = () => {
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPurchaseOrder({ supplier, amount });
    setMessage('Purchase order created!');
    setSupplier('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Purchase Order</h2>
      <div>
        <label>Supplier</label>
        <input value={supplier} onChange={e => setSupplier(e.target.value)} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default PurchaseOrderForm; 