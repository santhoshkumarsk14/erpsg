import React, { useEffect, useState } from 'react';
import { getTools, deleteTool, downloadToolExcel } from '../../services/toolsService';

const ToolList: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    const res = await getTools();
    setTools(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteTool(id);
    fetchTools();
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadToolExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tool-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tools</h2>
      <ul>
        {tools.map(tool => (
          <li key={tool.id} style={{ color: tool.overdue ? 'orange' : tool.lost ? 'red' : tool.missing ? 'purple' : undefined }}>
            {tool.name} (SN: {tool.serialNumber}), Status: {tool.status}, Location: {tool.location},
            Asset Tag: {tool.assetTag}, Make: {tool.make}, Model: {tool.model}, Purchase: {tool.purchaseDate}, Maintenance: {tool.maintenanceDate},
            Responsible: {tool.responsiblePerson}, Last User: {tool.lastUserId},
            Overdue: {tool.overdue ? 'Yes' : 'No'}, Lost: {tool.lost ? 'Yes' : 'No'}, Missing: {tool.missing ? 'Yes' : 'No'},
            Maintenance Schedule: {tool.maintenanceSchedule}, Reminder: {tool.maintenanceReminder}, Notes: {tool.notes}
            {tool.imageUrl && <img src={tool.imageUrl} alt="tool" style={{ width: 40, height: 40, marginLeft: 8 }} />}
            {tool.overdue && <strong> [OVERDUE!]</strong>}
            {tool.lost && <strong> [LOST!]</strong>}
            {tool.missing && <strong> [MISSING!]</strong>}
            <button onClick={() => handleDelete(tool.id)}>Delete</button>
            <button onClick={() => handleDownloadExcel(tool.id)} disabled={downloadingExcel[tool.id]}>Download Excel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToolList; 