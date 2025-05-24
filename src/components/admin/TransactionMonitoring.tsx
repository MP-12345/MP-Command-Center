
import React from 'react';
import { EnhancedTransactionMonitoring } from './EnhancedTransactionMonitoring';

interface TransactionMonitoringProps {
  department: string;
}

export const TransactionMonitoring: React.FC<TransactionMonitoringProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Transaction Monitoring</h2>
        <p className="text-gray-600">
          Advanced transaction monitoring and analysis for {department.replace('_', ' ')} department
        </p>
      </div>
      
      <EnhancedTransactionMonitoring department={department} />
    </div>
  );
};
