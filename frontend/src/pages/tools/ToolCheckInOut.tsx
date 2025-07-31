import React, { useState } from 'react';
import { checkOutTool, checkInTool } from '../../services/toolsService';

const ToolCheckInOut: React.FC = () => {
  const [toolId, setToolId] = useState('');
  const [userId, setUserId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckOut = async () => {
    await checkOutTool(Number(toolId), Number(userId), remarks);
    setMessage('Tool checked out!');
  };

  const handleCheckIn = async () => {
    await checkInTool(Number(toolId), Number(userId), remarks);
    setMessage('Tool checked in!');
  };

  return (
    <div>
      <h2>Tool Check In/Out</h2>
      <div>
        <label>Tool ID</label>
        <input value={toolId} onChange={e => setToolId(e.target.value)} />
      </div>
      <div>
        <label>User ID</label>
        <input value={userId} onChange={e => setUserId(e.target.value)} />
      </div>
      <div>
        <label>Remarks</label>
        <input value={remarks} onChange={e => setRemarks(e.target.value)} />
      </div>
      <button onClick={handleCheckOut}>Check Out</button>
      <button onClick={handleCheckIn}>Check In</button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default ToolCheckInOut; 