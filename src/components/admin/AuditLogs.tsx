
import React from 'react';
import { AuditPanel } from './AuditPanel';

interface AuditLogsProps {
  department: string;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Audit Logs</h2>
        <p className="text-gray-600">Review system audit trails and admin activities</p>
      </div>

      <AuditPanel department={department} />
    </div>
  );
};
