import React, { useState, useEffect } from 'react';
import { createAttendance, updateAttendance, getAttendanceById } from '../../services/hrService';
import { getEmployees } from '../../services/hrService';
import { getProjects } from '../../services/timesheetService';

interface AttendanceFormProps {
  attendanceId?: number;
  onSuccess?: () => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ attendanceId, onSuccess }) => {
  const [form, setForm] = useState<any>({
    employeeId: '',
    projectId: '',
    date: '',
    clockIn: '',
    clockOut: '',
    location: '',
    method: '',
    remarks: '',
  });
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    if (attendanceId) {
      fetchAttendance(attendanceId);
    }
    // eslint-disable-next-line
  }, [attendanceId]);

  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data.data || []);
  };
  const fetchProjects = async () => {
    if (getProjects) {
      const res = await getProjects();
      setProjects(res.data.data || []);
    }
  };
  const fetchAttendance = async (id: number) => {
    setLoading(true);
    const res = await getAttendanceById(id);
    setForm(res.data.data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (attendanceId) {
        await updateAttendance(attendanceId, form);
      } else {
        await createAttendance(form);
      }
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError('Failed to save attendance');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{attendanceId ? 'Edit' : 'Add'} Attendance</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Employee:</label>
        <select name="employeeId" value={form.employeeId} onChange={handleChange} required>
          <option value="">Select</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name || emp.id}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Project:</label>
        <select name="projectId" value={form.projectId} onChange={handleChange} required>
          <option value="">Select</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name || proj.id}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>
      <div>
        <label>Clock In:</label>
        <input type="time" name="clockIn" value={form.clockIn} onChange={handleChange} required />
      </div>
      <div>
        <label>Clock Out:</label>
        <input type="time" name="clockOut" value={form.clockOut} onChange={handleChange} required />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} />
      </div>
      <div>
        <label>Method:</label>
        <input type="text" name="method" value={form.method} onChange={handleChange} />
      </div>
      <div>
        <label>Remarks:</label>
        <input type="text" name="remarks" value={form.remarks} onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>{attendanceId ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default AttendanceForm; 