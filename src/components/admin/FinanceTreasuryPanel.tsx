
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, TrendingUp, Users, CreditCard, Activity } from 'lucide-react';

interface FinanceTreasuryPanelProps {
  department: string;
}

export const FinanceTreasuryPanel: React.FC<FinanceTreasuryPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeStats, setRealTimeStats] = useState({
    totalBalance: 0,
    totalTransactions: 0,
    totalVolume: 0,
    totalFees: 0,
    totalUsers: 0,
    transactionCount: 0
  });

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ['finance-profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone_number,
          mirackle_id,
          balance,
          transaction_count,
          created_at,
          username,
          preferred_currency
        `)
        .order('balance', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,mirackle_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    }
  });

  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['finance-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: fees, refetch: refetchFees } = useQuery({
    queryKey: ['finance-fees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  // Real-time updates every 2 seconds for financial data
  useEffect(() => {
    const interval = setInterval(() => {
      refetchProfiles();
      refetchTransactions();
      refetchFees();
    }, 2000);

    return () => clearInterval(interval);
  }, [refetchProfiles, refetchTransactions, refetchFees]);

  // Calculate real-time financial metrics every second
  useEffect(() => {
    if (profiles && transactions && fees) {
      const totalBalance = profiles.reduce((sum, profile) => sum + Number(profile.balance || 0), 0);
      const totalTransactions = transactions.length;
      const totalVolume = transactions.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
      const totalFees = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
      const totalUsers = profiles.length;
      const transactionCount = profiles.reduce((sum, profile) => sum + Number(profile.transaction_count || 0), 0);

      setRealTimeStats({
        totalBalance,
        totalTransactions,
        totalVolume,
        totalFees,
        totalUsers,
        transactionCount
      });
    }
  }, [profiles, transactions, fees]);

  const getUserTransactionValue = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId)
      .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0) || 0;
  };

  const getUserTransactionCount = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId).length || 0;
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  if (profilesLoading || transactionsLoading) {
    return (
      <div className="space-y-4 p-6">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Loading Finance Data...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Real-time Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Platform Balance</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(realTimeStats.totalBalance)}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Data
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">{realTimeStats.totalTransactions.toLocaleString()}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Count
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transaction Volume</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(realTimeStats.totalVolume)}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Volume
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fee Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(realTimeStats.totalFees)}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Revenue
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{realTimeStats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Users
                </div>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Financial Reports */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="border-b bg-white border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Finance & Treasury Management</CardTitle>
              <CardDescription className="text-gray-600">Real-time financial operations and treasury monitoring</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Export Report</Button>
              <Button variant="outline">Generate Statement</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or MiraklePay ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-gray-500"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">User</TableHead>
                  <TableHead className="font-semibold text-gray-700">MiraklePay ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Balance</TableHead>
                  <TableHead className="font-semibold text-gray-700">Transaction Count</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Volume</TableHead>
                  <TableHead className="font-semibold text-gray-700">Account Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Join Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => {
                  const userVolume = getUserTransactionValue(profile.id);
                  const actualTransactionCount = getUserTransactionCount(profile.id);
                  const accountType = Number(profile.balance || 0) > 100000 ? 'Premium' : 'Standard';
                  
                  return (
                    <TableRow key={profile.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{profile.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 truncate">{profile.phone_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {profile.mirackle_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(Number(profile.balance || 0))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{actualTransactionCount}</div>
                          <div className="text-xs text-gray-500">Live Count</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(userVolume)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={accountType === 'Premium' ? 'default' : 'secondary'}>
                          {accountType}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-600">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Adjust Limits
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
