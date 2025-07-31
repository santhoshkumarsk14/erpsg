import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../../services/hrService';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await getEmployees();
    setEmployees(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    fetchEmployees();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>
            {emp.name} ({emp.position})
            <button onClick={() => handleDelete(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList; 