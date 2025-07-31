import React, { useState } from 'react';
import { createInvoice } from '../../services/invoiceService';

const InvoiceForm: React.FC = () => {
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInvoice({ client, amount, dueDate });
    setMessage('Invoice created!');
    setClient('');
    setAmount(0);
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Invoice</h2>
      <div>
        <label>Client</label>
        <input value={client} onChange={e => setClient(e.target.value)} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
      </div>
      <div>
        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default InvoiceForm; 