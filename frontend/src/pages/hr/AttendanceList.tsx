import React, { useEffect, useState } from 'react';
import { getAttendances, deleteAttendance } from '../../services/hrService';
// import { getEmployees } from '../../services/hrService'; // For employee name lookup
// import { getProjects } from '../../services/timesheetService'; // For project name lookup
import AttendanceForm from './AttendanceForm';

const AttendanceList: React.FC = () => {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    const res = await getAttendances();
    setAttendances(res.data.data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteAttendance(id);
    fetchAttendances();
  };

  const handleAdd = () => {
    setEditId(undefined);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditId(undefined);
    fetchAttendances();
  };

  return (
    <div>
      <h2>Attendance Records</h2>
      <button onClick={handleAdd}>Add Attendance</button>
      {showForm && (
        <AttendanceForm attendanceId={editId} onSuccess={handleFormSuccess} />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Project ID</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Location</th>
              <th>Method</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.employeeId}</td>
                <td>{a.projectId}</td>
                <td>{a.date}</td>
                <td>{a.clockIn}</td>
                <td>{a.clockOut}</td>
                <td>{a.location}</td>
                <td>{a.method}</td>
                <td>{a.remarks}</td>
                <td>
                  <button onClick={() => handleEdit(a.id)}>Edit</button>
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceList; 