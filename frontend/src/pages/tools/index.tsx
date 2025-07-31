import React from 'react';
import ToolForm from './ToolForm';
import ToolList from './ToolList';
import ToolTransactionList from './ToolTransactionList';
import ToolCheckInOut from './ToolCheckInOut';

const ToolsModule: React.FC = () => (
  <div>
    <h1>Tools & Equipment Management</h1>
    <ToolForm />
    <ToolList />
    <ToolCheckInOut />
    <ToolTransactionList />
  </div>
);

export default ToolsModule; 