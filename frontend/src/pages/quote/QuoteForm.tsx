import React, { useState } from 'react';
import { createQuote } from '../../services/quoteService';

const QuoteForm: React.FC = () => {
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createQuote({ client, amount });
    setMessage('Quote created!');
    setClient('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Quote</h2>
      <div>
        <label>Client</label>
        <input value={client} onChange={e => setClient(e.target.value)} required />
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

export default QuoteForm; 