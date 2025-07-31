import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CogIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
  feature?: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { hasAccess } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'HR Management', to: '/hr', icon: UserGroupIcon, feature: 'hr' },
    { name: 'Payroll', to: '/payroll', icon: CurrencyDollarIcon, feature: 'payroll' },
    { name: 'Leave Management', to: '/leave', icon: CalendarIcon, feature: 'hr' },
    { name: 'Timesheets', to: '/timesheets', icon: ClockIcon, feature: 'timesheet' },
    { name: 'Appendix', to: '/appendix', icon: DocumentDuplicateIcon, feature: 'timesheet' },
    { name: 'Invoices', to: '/invoices', icon: DocumentTextIcon, feature: 'invoice' },
    { name: 'Quotes', to: '/quotes', icon: DocumentTextIcon, feature: 'invoice' },
    { name: 'Procurement', to: '/procurement', icon: ShoppingCartIcon, feature: 'procurement' },
    { name: 'Reports', to: '/reports', icon: ChartBarIcon, feature: 'basic_reporting' },
    { name: 'Settings', to: '/settings', icon: CogIcon },
  ];

  return (
    <div className="h-full w-64 bg-navy text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">BizOps</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            // Skip items that the user doesn't have access to
            if (item.feature && !hasAccess(item.feature)) {
              return null;
            }
            
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            
            return (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-navy-light hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-navy-light">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-white">BizOps</p>
            <p className="text-xs text-gray-300">© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;