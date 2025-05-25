
import React from 'react';
import { FinanceTreasuryPanel } from './FinanceTreasuryPanel';

interface FinanceManagementProps {
  department: string;
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Finance & Treasury</h2>
        <p className="text-gray-600">Manage financial operations and treasury</p>
      </div>

      <FinanceTreasuryPanel department={department} />
    </div>
  );
};
