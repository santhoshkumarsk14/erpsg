import React from 'react';
import HRModule, { AttendanceList } from '../pages/hr';

const hrRoutes = [
  {
    path: '/hr',
    element: <HRModule />,
  },
  {
    path: '/hr/attendance',
    element: <AttendanceList />,
  },
];

export default hrRoutes; 