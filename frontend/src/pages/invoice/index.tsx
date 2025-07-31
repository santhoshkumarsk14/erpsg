import React from 'react';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';

const InvoiceModule: React.FC = () => (
  <div>
    <h1>Invoice Management</h1>
    <InvoiceForm />
    <InvoiceList />
  </div>
);

export default InvoiceModule; 