import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { 
  ChartBarIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const { user, company } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    totalTimeTracked: 0,
    activeProjects: 0,
    totalEmployees: 0,
    pendingPurchaseOrders: 0
  });

  // Simulated data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Expenses',
        data: [8000, 12000, 10000, 15000, 14000, 18000],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const projectData = {
    labels: ['In Progress', 'Completed', 'On Hold', 'Cancelled'],
    datasets: [
      {
        label: 'Projects',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(251, 191, 36, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const timeTrackingData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Hours Tracked',
        data: [35, 42, 38, 45, 40, 15, 5],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      },
    ],
  };

  // Simulated API call to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await api.get('/dashboard/stats');
        // setStats(response.data);
        
        // Simulated data
        setStats({
          totalRevenue: 125000,
          pendingInvoices: 12,
          totalTimeTracked: 1250,
          activeProjects: 8,
          totalEmployees: 24,
          pendingPurchaseOrders: 5
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <Loading size="lg" text="Loading dashboard..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName}! Here's an overview of your business.
          </p>
        </div>
        
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/invoices')}
                  >
                    View invoices
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Hours Tracked</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalTimeTracked} hrs</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/timesheets')}
                  >
                    View timesheets
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Invoices</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.pendingInvoices}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/invoices?status=pending')}
                  >
                    View pending invoices
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.activeProjects}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/projects')}
                  >
                    View projects
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalEmployees}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/employees')}
                  >
                    View employees
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <ShoppingCartIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Purchase Orders</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.pendingPurchaseOrders}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/procurement/purchase-orders?status=pending')}
                  >
                    View purchase orders
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Revenue vs Expenses</h3>
                <div className="mt-2 h-64">
                  <Line 
                    data={revenueData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Project Status</h3>
                <div className="mt-2 h-64 flex justify-center items-center">
                  <div style={{ width: '80%', height: '100%' }}>
                    <Doughnut 
                      data={projectData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow sm:col-span-2">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Weekly Time Tracking</h3>
                <div className="mt-2 h-64">
                  <Bar 
                    data={timeTrackingData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Hours'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <Button
                    onClick={() => navigate('/timesheets/new')}
                    className="flex justify-center items-center"
                  >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    New Timesheet
                  </Button>
                  <Button
                    onClick={() => navigate('/invoices/new')}
                    className="flex justify-center items-center"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Create Invoice
                  </Button>
                  <Button
                    onClick={() => navigate('/projects/new')}
                    className="flex justify-center items-center"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    New Project
                  </Button>
                  <Button
                    onClick={() => navigate('/employees/new')}
                    className="flex justify-center items-center"
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;