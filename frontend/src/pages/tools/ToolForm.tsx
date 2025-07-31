import React, { useState } from 'react';
import { createTool } from '../../services/toolsService';

const ToolForm: React.FC = () => {
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState('IN');
  const [location, setLocation] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [lastUserId, setLastUserId] = useState('');
  const [overdue, setOverdue] = useState(false);
  const [lost, setLost] = useState(false);
  const [missing, setMissing] = useState(false);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState('');
  const [maintenanceReminder, setMaintenanceReminder] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTool({
      name, serialNumber, status, location, assetTag, make, model, purchaseDate, maintenanceDate, imageUrl, responsiblePerson, lastUserId, overdue, lost, missing, maintenanceSchedule, maintenanceReminder, notes
    });
    setMessage('Tool created!');
    setName(''); setSerialNumber(''); setStatus('IN'); setLocation(''); setAssetTag(''); setMake(''); setModel(''); setPurchaseDate(''); setMaintenanceDate(''); setImageUrl(''); setResponsiblePerson(''); setLastUserId(''); setOverdue(false); setLost(false); setMissing(false); setMaintenanceSchedule(''); setMaintenanceReminder(''); setNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Tool</h2>
      <div><label>Name</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
      <div><label>Serial Number</label><input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required /></div>
      <div><label>Status</label><select value={status} onChange={e => setStatus(e.target.value)}><option value="IN">IN</option><option value="OUT">OUT</option><option value="LOST">LOST</option><option value="MISSING">MISSING</option></select></div>
      <div><label>Location</label><input value={location} onChange={e => setLocation(e.target.value)} /></div>
      <div><label>Asset Tag</label><input value={assetTag} onChange={e => setAssetTag(e.target.value)} /></div>
      <div><label>Make</label><input value={make} onChange={e => setMake(e.target.value)} /></div>
      <div><label>Model</label><input value={model} onChange={e => setModel(e.target.value)} /></div>
      <div><label>Purchase Date</label><input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} /></div>
      <div><label>Maintenance Date</label><input type="date" value={maintenanceDate} onChange={e => setMaintenanceDate(e.target.value)} /></div>
      <div><label>Image URL</label><input value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
      <div><label>Responsible Person</label><input value={responsiblePerson} onChange={e => setResponsiblePerson(e.target.value)} /></div>
      <div><label>Last User ID</label><input value={lastUserId} onChange={e => setLastUserId(e.target.value)} /></div>
      <div><label>Overdue</label><input type="checkbox" checked={overdue} onChange={e => setOverdue(e.target.checked)} /></div>
      <div><label>Lost</label><input type="checkbox" checked={lost} onChange={e => setLost(e.target.checked)} /></div>
      <div><label>Missing</label><input type="checkbox" checked={missing} onChange={e => setMissing(e.target.checked)} /></div>
      <div><label>Maintenance Schedule</label><input value={maintenanceSchedule} onChange={e => setMaintenanceSchedule(e.target.value)} /></div>
      <div><label>Maintenance Reminder</label><input value={maintenanceReminder} onChange={e => setMaintenanceReminder(e.target.value)} /></div>
      <div><label>Notes</label><input value={notes} onChange={e => setNotes(e.target.value)} /></div>
      <button type="submit">Create</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default ToolForm; 