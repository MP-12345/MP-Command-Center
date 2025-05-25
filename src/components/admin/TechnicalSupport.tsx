
import React from 'react';
import { TechnicalSupportPanel } from './TechnicalSupportPanel';

interface TechnicalSupportProps {
  department: string;
}

export const TechnicalSupport: React.FC<TechnicalSupportProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Technical Support</h2>
        <p className="text-gray-600">Manage technical issues and Web3 operations</p>
      </div>

      <TechnicalSupportPanel department={department} />
    </div>
  );
};
