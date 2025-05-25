
import React from 'react';
import { ComplianceKYCPanel } from './ComplianceKYCPanel';

interface KYCManagementProps {
  department: string;
}

export const KYCManagement: React.FC<KYCManagementProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">KYC Management</h2>
        <p className="text-gray-600">Manage user verification requests</p>
      </div>
      
      <ComplianceKYCPanel department={department} />
    </div>
  );
};
