import React, { useEffect, useState } from 'react';
import timesheetService, { approveTimesheet, rejectTimesheet, downloadTimesheetExcel, Timesheet } from '../../services/timesheetService';
import { useAuth } from '../../contexts/AuthContext';

const TimesheetList: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: string]: boolean }>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchTimesheets(page);
  }, [page]);

  const fetchTimesheets = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await timesheetService.getTimesheets({ page: currentPage, size: 10 });
      setTimesheets(res.content);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch timesheets", error);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    if (!user) return alert("You must be logged in.");
    const remarks = prompt("Enter approval remarks (optional):");
    if (remarks !== null) {
      await approveTimesheet(id, user.id, remarks || '');
      fetchTimesheets(page);
    }
  };

  const handleReject = async (id: string) => {
    if (!user) return alert("You must be logged in.");
    const remarks = prompt("Enter rejection remarks:");
    if (remarks) {
      await rejectTimesheet(id, user.id, remarks);
      fetchTimesheets(page);
    }
  };

  const handleDownloadExcel = async (id: string) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    try {
      const response = await downloadTimesheetExcel(id);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `timesheet-${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Failed to download excel", error);
    }
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Timesheets</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Trade</th>
            <th>Request No</th>
            <th>Item Desc</th>
            <th>Module</th>
            <th>Subcode</th>
            <th>Insp Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Project ID</th>
            <th>Employee ID</th>
            <th>Base Hr</th>
            <th>OT Hr</th>
            <th>Sat Hr</th>
            <th>Sun Hr</th>
            <th>Total Hr</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map(ts => (
            <tr key={ts.id}>
              <td>{ts.id}</td>
              <td>{ts.trade}</td>
              <td>{ts.requestNo}</td>
              <td>{ts.itemDesc}</td>
              <td>{ts.module}</td>
              <td>{ts.subcode}</td>
              <td>{ts.inspDate}</td>
              <td>{ts.startTime}</td>
              <td>{ts.endTime}</td>
              <td>{ts.location}</td>
              <td>{ts.projectId}</td>
              <td>{ts.employeeId}</td>
              <td>{ts.baseHr}</td>
              <td>{ts.otHr}</td>
              <td>{ts.satHr}</td>
              <td>{ts.sunHr}</td>
              <td>{ts.totalHr}</td>
              <td>{ts.status}</td>
              <td>{ts.remarks}</td>
              <td>
                <button onClick={() => handleApprove(ts.id)}>Approve</button>
                <button onClick={() => handleReject(ts.id)}>Reject</button>
                <button onClick={() => handleDownloadExcel(ts.id)} disabled={downloadingExcel[ts.id]}>Download Excel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TimesheetList; 