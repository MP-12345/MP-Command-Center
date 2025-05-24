
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskManagementProps {
  department: string;
}

export const RiskManagement: React.FC<RiskManagementProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Risk Management</h2>
        <p className="text-gray-600">Monitor and manage platform risks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flagged Transactions</CardTitle>
            <CardDescription>Transactions requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">12</p>
            <p className="text-sm text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
            <CardDescription>Overall platform risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">Low</p>
            <p className="text-sm text-muted-foreground">Risk assessment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
