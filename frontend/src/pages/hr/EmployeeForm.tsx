import React, { useState } from 'react';
import { createEmployee } from '../../services/hrService';

const EmployeeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [benefits, setBenefits] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmployee({ name, email, position, department, benefits });
    setMessage('Employee created!');
    setName('');
    setEmail('');
    setPosition('');
    setDepartment('');
    setBenefits('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Employee</h2>
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Position</label>
        <input value={position} onChange={e => setPosition(e.target.value)} required />
      </div>
      <div>
        <label>Department</label>
        <input value={department} onChange={e => setDepartment(e.target.value)} />
      </div>
      <div>
        <label>Benefits</label>
        <input value={benefits} onChange={e => setBenefits(e.target.value)} />
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default EmployeeForm; 