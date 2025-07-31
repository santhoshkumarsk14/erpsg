import React, { useEffect, useState } from 'react';
import { getTimesheets, approveTimesheet, rejectTimesheet, downloadTimesheetExcel } from '../../services/timesheetService';

const TimesheetList: React.FC = () => {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    setLoading(true);
    const res = await getTimesheets();
    setTimesheets(res.data.data);
    setLoading(false);
  };

  const handleApprove = async (id: number, approverId: number) => {
    await approveTimesheet(id, approverId);
    fetchTimesheets();
  };

  const handleReject = async (id: number, approverId: number) => {
    await rejectTimesheet(id, approverId);
    fetchTimesheets();
  };

  const handleDownloadExcel = async (id: string) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadTimesheetExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `timesheet-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
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
                <button onClick={() => handleApprove(ts.id, 1)}>Approve</button>
                <button onClick={() => handleReject(ts.id, 1)}>Reject</button>
                <button onClick={() => handleDownloadExcel(ts.id)} disabled={downloadingExcel[ts.id]}>Download Excel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetList; 