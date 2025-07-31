import React from 'react';
import timesheetRoutes from './timesheetRoutes';
import hrRoutes from './hrRoutes';
import payrollRoutes from './payrollRoutes';
import leaveRoutes from './leaveRoutes';
import invoiceRoutes from './invoiceRoutes';
import quoteRoutes from './quoteRoutes';
import procurementRoutes from './procurementRoutes';
import toolsRoutes from './toolsRoutes';
import appendixRoutes from './appendixRoutes';
import dashboardRoutes from './dashboardRoutes';
import CompanyOnboard from '../pages/CompanyOnboard';

const routes = [
  ...dashboardRoutes,
  ...appendixRoutes,
  ...toolsRoutes,
  ...procurementRoutes,
  ...quoteRoutes,
  ...invoiceRoutes,
  ...leaveRoutes,
  ...payrollRoutes,
  ...hrRoutes,
  ...timesheetRoutes,
  { path: '/onboard', element: <CompanyOnboard /> },
];

export default routes; 