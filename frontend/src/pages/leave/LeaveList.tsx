import React, { useEffect, useState } from 'react';
import { getLeaveRequests, approveLeaveRequest, rejectLeaveRequest, deleteLeaveRequest, uploadSupportingDocument, exportLeaveAsCalendar, downloadLeaveExcel } from '../../services/leaveService';

const LeaveList: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
  const [downloading, setDownloading] = useState<{ [key: number]: boolean }>({});
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    const res = await getLeaveRequests();
    setLeaves(res.data.data);
    setLoading(false);
  };

  const handleApprove = async (id: number) => {
    await approveLeaveRequest(id);
    fetchLeaves();
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Enter rejection reason:') || '';
    await rejectLeaveRequest(id, reason);
    fetchLeaves();
  };

  const handleDelete = async (id: number) => {
    await deleteLeaveRequest(id);
    fetchLeaves();
  };

  const handleUpload = async (id: number, file: File) => {
    setUploading(u => ({ ...u, [id]: true }));
    await uploadSupportingDocument(id, file);
    setUploading(u => ({ ...u, [id]: false }));
    fetchLeaves();
  };

  const handleExportCalendar = async (id: number) => {
    setDownloading(d => ({ ...d, [id]: true }));
    const res = await exportLeaveAsCalendar(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/calendar' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leave-${id}.ics`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloading(d => ({ ...d, [id]: false }));
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadLeaveExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leave-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Leave Requests</h2>
      <ul>
        {leaves.map(lr => (
          <li key={lr.id}>
            Employee: {lr.employeeId}, {lr.startDate} to {lr.endDate}, Type: {lr.type}, Status: {lr.status}
            <button onClick={() => handleApprove(lr.id)}>Approve</button>
            <button onClick={() => handleReject(lr.id)}>Reject</button>
            <button onClick={() => handleDelete(lr.id)}>Delete</button>
            <input type="file" onChange={e => e.target.files && handleUpload(lr.id, e.target.files[0])} disabled={uploading[lr.id]} />
            <button onClick={() => handleExportCalendar(lr.id)} disabled={downloading[lr.id]}>Export .ics</button>
            <button onClick={() => handleDownloadExcel(lr.id)} disabled={downloadingExcel[lr.id]}>Download Excel</button>
            {lr.supportingDocumentUrl && (
              <a href={lr.supportingDocumentUrl} target="_blank" rel="noopener noreferrer">View Doc</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveList; 