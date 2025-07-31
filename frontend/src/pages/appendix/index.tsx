import React from 'react';
import AppendixForm from './AppendixForm';
import AppendixList from './AppendixList';
// For demo, not wiring up AppendixItemForm, AppendixItemList, AppendixBulkUpdate directly here

const AppendixModule: React.FC = () => (
  <div>
    <h1>Appendix Management</h1>
    <AppendixForm />
    <AppendixList />
  </div>
);

export default AppendixModule; 