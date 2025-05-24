
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketingManagementProps {
  department: string;
}

export const MarketingManagement: React.FC<MarketingManagementProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Marketing Management</h2>
        <p className="text-gray-600">Manage marketing campaigns and referrals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Referrals</CardTitle>
            <CardDescription>Current referral campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,245</p>
            <p className="text-sm text-muted-foreground">Active referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Marketing campaign metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">85%</p>
            <p className="text-sm text-muted-foreground">Conversion rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
