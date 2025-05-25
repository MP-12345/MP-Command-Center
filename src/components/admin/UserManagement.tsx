
import React from 'react';
import { CustomerSupportPanel } from './CustomerSupportPanel';

interface UserManagementProps {
  department: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">User Management</h2>
        <p className="text-gray-600">
          Comprehensive user management for {department.replace('_', ' ')} department
        </p>
      </div>
      
      <CustomerSupportPanel department={department} />
    </div>
  );
};
