
import React from 'react';
import { RiskManagementPanel } from './RiskManagementPanel';

interface RiskManagementProps {
  department: string;
}

export const RiskManagement: React.FC<RiskManagementProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Risk Management & Fraud Detection</h2>
        <p className="text-gray-600">Real-time risk assessment and fraud monitoring system</p>
      </div>
      
      <RiskManagementPanel department={department} />
    </div>
  );
};
