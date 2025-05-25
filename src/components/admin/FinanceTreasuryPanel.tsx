
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';

interface FinanceTreasuryPanelProps {
  department: string;
}

export const FinanceTreasuryPanel: React.FC<FinanceTreasuryPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: profiles, isLoading: profilesLoading } = useQuery({
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
          created_at
        `)
        .order('balance', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,mirackle_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
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

  const { data: fees } = useQuery({
    queryKey: ['finance-fees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  // Calculate financial metrics
  const totalBalance = profiles?.reduce((sum, profile) => sum + Number(profile.balance), 0) || 0;
  const totalTransactions = transactions?.length || 0;
  const totalVolume = transactions?.reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0) || 0;
  const totalFees = fees?.reduce((sum, fee) => sum + Number(fee.amount), 0) || 0;
  const totalUsers = profiles?.length || 0;

  const getUserTransactionValue = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId)
      .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0) || 0;
  };

  if (profilesLoading || transactionsLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Finance Data...</CardTitle>
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
    <div className="space-y-4 p-4 md:p-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Platform Balance</p>
                <p className="text-2xl font-bold">₦{totalBalance.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transaction Volume</p>
                <p className="text-2xl font-bold">₦{totalVolume.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fee Revenue</p>
                <p className="text-2xl font-bold">₦{totalFees.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-lg md:text-xl">Finance & Treasury Management</CardTitle>
              <CardDescription>Monitor user balances and transaction volumes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or MiraklePay ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>MiraklePay ID</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Transaction Count</TableHead>
                  <TableHead>Total Volume</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => {
                  const userVolume = getUserTransactionValue(profile.id);
                  const accountType = Number(profile.balance) > 100000 ? 'Premium' : 'Standard';
                  
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{profile.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 truncate">{profile.phone_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {profile.mirackle_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          ₦{Number(profile.balance).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold">{profile.transaction_count}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          ₦{userVolume.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={accountType === 'Premium' ? 'default' : 'secondary'}>
                          {accountType}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
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
