
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Shield, DollarSign } from 'lucide-react';

interface DashboardOverviewProps {
  department: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ department }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-overview', department],
    queryFn: async () => {
      const [usersResult, transactionsResult, kycResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('transactions').select('*', { count: 'exact' }),
        supabase.from('kyc_verifications').select('*', { count: 'exact' })
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalTransactions: transactionsResult.count || 0,
        pendingKYC: kycResult.count || 0
      };
    }
  });

  const getDepartmentCards = () => {
    const baseCards = [
      {
        title: 'Total Users',
        value: stats?.totalUsers || 0,
        icon: Users,
        description: 'Registered users'
      }
    ];

    const departmentCards: Record<string, any[]> = {
      customer_support: [
        {
          title: 'Total Transactions',
          value: stats?.totalTransactions || 0,
          icon: CreditCard,
          description: 'All transactions'
        }
      ],
      compliance: [
        {
          title: 'Pending KYC',
          value: stats?.pendingKYC || 0,
          icon: Shield,
          description: 'Awaiting verification'
        }
      ],
      finance: [
        {
          title: 'Total Transactions',
          value: stats?.totalTransactions || 0,
          icon: DollarSign,
          description: 'Financial transactions'
        }
      ]
    };

    return [...baseCards, ...(departmentCards[department] || [])];
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const cards = getDepartmentCards();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 capitalize">
          {department.replace('_', ' ')} Department
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
