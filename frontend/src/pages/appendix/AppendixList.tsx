import React, { useEffect, useState } from 'react';
import { getAppendices, deleteAppendix, downloadAppendixExcel } from '../../services/appendixService';

const AppendixList: React.FC = () => {
  const [appendices, setAppendices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchAppendices();
  }, []);

  const fetchAppendices = async () => {
    setLoading(true);
    const res = await getAppendices();
    setAppendices(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteAppendix(id);
    fetchAppendices();
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadAppendixExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appendix-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Appendices</h2>
      <ul>
        {appendices.map(app => (
          <li key={app.id}>
            Timesheet: {app.timesheetId}, Status: {app.status}
            <button onClick={() => handleDelete(app.id)}>Delete</button>
            <button onClick={() => handleDownloadExcel(app.id)} disabled={downloadingExcel[app.id]}>Download Excel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppendixList; 