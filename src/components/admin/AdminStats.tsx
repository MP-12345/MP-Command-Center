
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Shield, DollarSign, AlertTriangle, TrendingUp, FileText, Settings } from 'lucide-react';

interface AdminStatsProps {
  department: string;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ department }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats', department],
    queryFn: async () => {
      const [
        usersResult,
        transactionsResult,
        kycResult,
        rewardsResult,
        feesResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('transactions').select('*', { count: 'exact' }),
        supabase.from('kyc_verifications').select('*', { count: 'exact' }),
        supabase.from('rewards').select('*', { count: 'exact' }),
        supabase.from('fees').select('amount').then(res => ({
          data: res.data,
          count: res.count,
          totalFees: res.data?.reduce((sum, fee) => sum + Number(fee.amount), 0) || 0
        }))
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalTransactions: transactionsResult.count || 0,
        pendingKYC: kycResult.data?.filter(k => k.status === 'pending').length || 0,
        totalRewards: rewardsResult.count || 0,
        totalFees: feesResult.totalFees || 0,
        verifiedUsers: usersResult.data?.filter(u => u.is_verified).length || 0,
        totalBalance: usersResult.data?.reduce((sum, user) => sum + Number(user.balance), 0) || 0
      };
    }
  });

  const getStatsForDepartment = () => {
    const baseStats = [
      {
        title: 'Total Users',
        value: stats?.totalUsers || 0,
        icon: Users,
        description: 'Registered users',
        trend: '+12%'
      }
    ];

    const departmentStats: Record<string, any[]> = {
      customer_support: [
        {
          title: 'Active Transactions',
          value: stats?.totalTransactions || 0,
          icon: CreditCard,
          description: 'Total transactions',
          trend: '+8%'
        },
        {
          title: 'Support Tickets',
          value: 45,
          icon: FileText,
          description: 'Open tickets',
          trend: '-5%'
        }
      ],
      compliance: [
        {
          title: 'Pending KYC',
          value: stats?.pendingKYC || 0,
          icon: Shield,
          description: 'Awaiting verification',
          trend: '+3%'
        },
        {
          title: 'Verified Users',
          value: stats?.verifiedUsers || 0,
          icon: Users,
          description: 'KYC approved',
          trend: '+15%'
        }
      ],
      finance: [
        {
          title: 'Total Balance',
          value: `₦${(stats?.totalBalance || 0).toLocaleString()}`,
          icon: DollarSign,
          description: 'Platform balance',
          trend: '+22%'
        },
        {
          title: 'Total Fees',
          value: `₦${(stats?.totalFees || 0).toLocaleString()}`,
          icon: TrendingUp,
          description: 'Collected fees',
          trend: '+18%'
        }
      ],
      risk: [
        {
          title: 'Risk Alerts',
          value: 12,
          icon: AlertTriangle,
          description: 'High risk transactions',
          trend: '+2%'
        },
        {
          title: 'Flagged Accounts',
          value: 8,
          icon: Shield,
          description: 'Under review',
          trend: '-10%'
        }
      ],
      operations: [
        {
          title: 'Daily Volume',
          value: `₦${(stats?.totalBalance || 0).toLocaleString()}`,
          icon: TrendingUp,
          description: 'Transaction volume',
          trend: '+25%'
        },
        {
          title: 'System Uptime',
          value: '99.9%',
          icon: Settings,
          description: 'Service availability',
          trend: '+0.1%'
        }
      ],
      marketing: [
        {
          title: 'Referral Rewards',
          value: stats?.totalRewards || 0,
          icon: TrendingUp,
          description: 'Active rewards',
          trend: '+30%'
        },
        {
          title: 'Campaign ROI',
          value: '285%',
          icon: DollarSign,
          description: 'Return on investment',
          trend: '+45%'
        }
      ],
      technical: [
        {
          title: 'API Calls',
          value: '1.2M',
          icon: Settings,
          description: 'Monthly API usage',
          trend: '+15%'
        },
        {
          title: 'Error Rate',
          value: '0.01%',
          icon: AlertTriangle,
          description: 'System errors',
          trend: '-20%'
        }
      ],
      audit: [
        {
          title: 'Audit Logs',
          value: '5,420',
          icon: FileText,
          description: 'Recorded events',
          trend: '+5%'
        },
        {
          title: 'Compliance Score',
          value: '98%',
          icon: Shield,
          description: 'Regulatory compliance',
          trend: '+2%'
        }
      ]
    };

    return [...baseStats, ...(departmentStats[department] || [])];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const departmentStats = getStatsForDepartment();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {departmentStats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositiveTrend = stat.trend.startsWith('+');
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className={`text-xs font-medium ${
                  isPositiveTrend ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
