import React, { useEffect, useState } from 'react';
import { getKPIs } from '../../services/analyticsService';
import NotificationList from './NotificationList';

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<any>({});
  const [loading, setLoading] = useState(true);
  // TODO: Replace with real user context
  const userId = 1;

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    setLoading(true);
    const res = await getKPIs();
    setKpis(res.data.data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <NotificationList userId={userId} />
      <div>Total Users: {kpis.totalUsers}</div>
      <div>Active Projects: {kpis.activeProjects}</div>
      <div>Pending Timesheets: {kpis.pendingTimesheets}</div>
      <div>Total Invoices: {kpis.totalInvoices}</div>
      <div>Revenue: ${kpis.revenue}</div>
    </div>
  );
};

export default Dashboard; 