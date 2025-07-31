import React, { useState } from 'react';
import { createAppendix } from '../../services/appendixService';

const AppendixForm: React.FC = () => {
  const [timesheetId, setTimesheetId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppendix({ timesheetId });
    setMessage('Appendix created!');
    setTimesheetId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Appendix</h2>
      <div>
        <label>Timesheet ID</label>
        <input value={timesheetId} onChange={e => setTimesheetId(e.target.value)} required />
      </div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default AppendixForm; 