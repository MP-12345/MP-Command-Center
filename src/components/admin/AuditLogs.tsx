
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activities</CardTitle>
          <CardDescription>Latest administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Audit log functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
