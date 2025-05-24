
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Platform revenue and fees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦2,450,000</p>
            <p className="text-sm text-muted-foreground">Total platform revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Fees</CardTitle>
            <CardDescription>Collected transaction fees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦145,000</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
