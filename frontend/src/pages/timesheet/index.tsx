import React from 'react';
import TimesheetList from './TimesheetList';
import TimesheetForm from './TimesheetForm';
import ProjectList from './ProjectList';
import TaskList from './TaskList';

const TimesheetModule: React.FC = () => (
  <div>
    <h1>Timesheet Management</h1>
    <TimesheetForm />
    <TimesheetList />
    <ProjectList />
    <TaskList />
  </div>
);

export default TimesheetModule; 