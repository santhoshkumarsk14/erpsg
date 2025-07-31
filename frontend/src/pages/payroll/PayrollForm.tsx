import React, { useState } from 'react';
import { createPayroll } from '../../services/payrollService';

const PayrollForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [period, setPeriod] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPayroll({ employeeId, period, amount, status });
    setMessage('Payroll created!');
    setEmployeeId('');
    setPeriod('');
    setAmount(0);
    setStatus('PENDING');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Payroll</h2>
      <div>
        <label>Employee ID</label>
        <input value={employeeId} onChange={e => setEmployeeId(e.target.value)} required />
      </div>
      <div>
        <label>Period</label>
        <input value={period} onChange={e => setPeriod(e.target.value)} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
        </select>
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default PayrollForm; 