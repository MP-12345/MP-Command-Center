
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <p className="text-blue-100 mb-4">Access frequently used features for your department</p>
          <div className="space-y-2">
            {department === 'customer_support' && (
              <>
                <div className="bg-white/20 p-2 rounded">📞 Handle Support Tickets</div>
                <div className="bg-white/20 p-2 rounded">👥 User Account Management</div>
              </>
            )}
            {department === 'compliance' && (
              <>
                <div className="bg-white/20 p-2 rounded">🛡️ Review KYC Documents</div>
                <div className="bg-white/20 p-2 rounded">📋 Compliance Reports</div>
              </>
            )}
            {department === 'finance' && (
              <>
                <div className="bg-white/20 p-2 rounded">💰 Treasury Management</div>
                <div className="bg-white/20 p-2 rounded">📊 Financial Reports</div>
              </>
            )}
            {department === 'risk' && (
              <>
                <div className="bg-white/20 p-2 rounded">⚠️ Risk Assessment</div>
                <div className="bg-white/20 p-2 rounded">🔍 Fraud Detection</div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">New user verification completed</span>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Transaction processed successfully</span>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">System maintenance scheduled</span>
              <span className="text-xs text-gray-500">10 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
