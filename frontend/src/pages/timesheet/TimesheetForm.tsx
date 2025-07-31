import React, { useState } from 'react';
import { createTimesheet } from '../../services/timesheetService';

const TimesheetForm: React.FC = () => {
  const [trade, setTrade] = useState('');
  const [requestNo, setRequestNo] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [module, setModule] = useState('');
  const [subcode, setSubcode] = useState('');
  const [inspDate, setInspDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [projectId, setProjectId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [baseHr, setBaseHr] = useState(0);
  const [otHr, setOtHr] = useState(0);
  const [satHr, setSatHr] = useState(0);
  const [sunHr, setSunHr] = useState(0);
  const [totalHr, setTotalHr] = useState(0);
  const [status, setStatus] = useState('DRAFT');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTimesheet({
      trade, requestNo, itemDesc, module, subcode, inspDate, startTime, endTime, location, projectId, employeeId, baseHr, otHr, satHr, sunHr, totalHr, status, remarks
    });
    setMessage('Timesheet created!');
    setTrade(''); setRequestNo(''); setItemDesc(''); setModule(''); setSubcode(''); setInspDate(''); setStartTime(''); setEndTime(''); setLocation(''); setProjectId(''); setEmployeeId(''); setBaseHr(0); setOtHr(0); setSatHr(0); setSunHr(0); setTotalHr(0); setStatus('DRAFT'); setRemarks('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Timesheet</h2>
      <div><label>Trade</label><input value={trade} onChange={e => setTrade(e.target.value)} /></div>
      <div><label>Request No</label><input value={requestNo} onChange={e => setRequestNo(e.target.value)} /></div>
      <div><label>Item Desc</label><input value={itemDesc} onChange={e => setItemDesc(e.target.value)} /></div>
      <div><label>Module</label><input value={module} onChange={e => setModule(e.target.value)} /></div>
      <div><label>Subcode</label><input value={subcode} onChange={e => setSubcode(e.target.value)} /></div>
      <div><label>Inspection Date</label><input type="date" value={inspDate} onChange={e => setInspDate(e.target.value)} /></div>
      <div><label>Start Time</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
      <div><label>End Time</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
      <div><label>Location</label><input value={location} onChange={e => setLocation(e.target.value)} /></div>
      <div><label>Project ID</label><input value={projectId} onChange={e => setProjectId(e.target.value)} /></div>
      <div><label>Employee ID</label><input value={employeeId} onChange={e => setEmployeeId(e.target.value)} /></div>
      <div><label>Base Hr</label><input type="number" value={baseHr} onChange={e => setBaseHr(Number(e.target.value))} /></div>
      <div><label>OT Hr</label><input type="number" value={otHr} onChange={e => setOtHr(Number(e.target.value))} /></div>
      <div><label>Sat Hr</label><input type="number" value={satHr} onChange={e => setSatHr(Number(e.target.value))} /></div>
      <div><label>Sun Hr</label><input type="number" value={sunHr} onChange={e => setSunHr(Number(e.target.value))} /></div>
      <div><label>Total Hr</label><input type="number" value={totalHr} onChange={e => setTotalHr(Number(e.target.value))} /></div>
      <div><label>Status</label><input value={status} onChange={e => setStatus(e.target.value)} /></div>
      <div><label>Remarks</label><input value={remarks} onChange={e => setRemarks(e.target.value)} /></div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default TimesheetForm; 