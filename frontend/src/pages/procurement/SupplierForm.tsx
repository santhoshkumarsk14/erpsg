import React, { useState } from 'react';
import { createSupplier } from '../../services/procurementService';

const SupplierForm: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSupplier({ name, contact, email, phone, address });
    setMessage('Supplier created!');
    setName('');
    setContact('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Supplier</h2>
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Contact</label>
        <input value={contact} onChange={e => setContact(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Phone</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div>
        <label>Address</label>
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default SupplierForm; 