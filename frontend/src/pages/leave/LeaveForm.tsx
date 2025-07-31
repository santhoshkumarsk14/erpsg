import React, { useState } from 'react';
import { createLeaveRequest } from '../../services/leaveService';

const LeaveForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('ANNUAL');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLeaveRequest({ employeeId, startDate, endDate, type, reason });
    setMessage('Leave request created!');
    setEmployeeId('');
    setStartDate('');
    setEndDate('');
    setType('ANNUAL');
    setReason('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Leave Request</h2>
      <div>
        <label>Employee ID</label>
        <input value={employeeId} onChange={e => setEmployeeId(e.target.value)} required />
      </div>
      <div>
        <label>Start Date</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      </div>
      <div>
        <label>End Date</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
      </div>
      <div>
        <label>Type</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="ANNUAL">ANNUAL</option>
          <option value="SICK">SICK</option>
          <option value="UNPAID">UNPAID</option>
        </select>
      </div>
      <div>
        <label>Reason</label>
        <input value={reason} onChange={e => setReason(e.target.value)} />
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default LeaveForm; 