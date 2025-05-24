
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Web3 Transactions</CardTitle>
            <CardDescription>Blockchain transaction monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">342</p>
            <p className="text-sm text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">Operational</p>
            <p className="text-sm text-muted-foreground">All systems running</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
