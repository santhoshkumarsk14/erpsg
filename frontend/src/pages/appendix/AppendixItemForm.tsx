import React, { useState } from 'react';
import { createAppendixItem } from '../../services/appendixService';

const AppendixItemForm: React.FC<{ appendixId: number }> = ({ appendixId }) => {
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('INCOMPLETE');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppendixItem({ appendixId, description, status });
    setMessage('Appendix item created!');
    setDescription('');
    setStatus('INCOMPLETE');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Appendix Item</h3>
      <div>
        <label>Description</label>
        <input value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="INCOMPLETE">INCOMPLETE</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default AppendixItemForm; 