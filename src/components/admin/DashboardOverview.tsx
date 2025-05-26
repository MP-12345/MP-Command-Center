
import React from 'react';
import { AdminStats } from './AdminStats';

interface DashboardOverviewProps {
  department: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 capitalize">
          {department.replace('_', ' ')} Department - Real-time Analytics & Insights
        </p>
      </div>
      
      <AdminStats department={department} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Quick Actions</h3>
          <p className="text-gray-600 mb-4">Access frequently used features for your department</p>
          <div className="space-y-2">
            {department === 'customer_support' && (
              <>
                <div className="bg-gray-50 p-2 rounded text-gray-700">📞 Handle Support Tickets</div>
                <div className="bg-gray-50 p-2 rounded text-gray-700">👥 User Account Management</div>
              </>
            )}
            {department === 'compliance' && (
              <>
                <div className="bg-gray-50 p-2 rounded text-gray-700">🛡️ Review KYC Documents</div>
                <div className="bg-gray-50 p-2 rounded text-gray-700">📋 Compliance Reports</div>
              </>
            )}
            {department === 'finance' && (
              <>
                <div className="bg-gray-50 p-2 rounded text-gray-700">💰 Treasury Management</div>
                <div className="bg-gray-50 p-2 rounded text-gray-700">📊 Financial Reports</div>
              </>
            )}
            {department === 'risk' && (
              <>
                <div className="bg-gray-50 p-2 rounded text-gray-700">⚠️ Risk Assessment</div>
                <div className="bg-gray-50 p-2 rounded text-gray-700">🔍 Fraud Detection</div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">All systems operational</span>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Database connectivity stable</span>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Real-time updates active</span>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
