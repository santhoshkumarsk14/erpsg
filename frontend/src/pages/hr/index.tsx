import React from 'react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const HRModule: React.FC = () => (
  <div>
    <h1>HR Management</h1>
    <EmployeeForm />
    <EmployeeList />
  </div>
);

export { default as AttendanceList } from './AttendanceList';
export { default as AttendanceForm } from './AttendanceForm';

export default HRModule; 