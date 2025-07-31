import React from 'react';
import PayrollList from './PayrollList';
import PayrollForm from './PayrollForm';

const PayrollModule: React.FC = () => (
  <div>
    <h1>Payroll Management</h1>
    <PayrollForm />
    <PayrollList />
  </div>
);

export default PayrollModule; 