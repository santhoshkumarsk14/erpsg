import React from 'react';
import LeaveList from './LeaveList';
import LeaveForm from './LeaveForm';

const LeaveModule: React.FC = () => (
  <div>
    <h1>Leave Management</h1>
    <LeaveForm />
    <LeaveList />
  </div>
);

export default LeaveModule; 