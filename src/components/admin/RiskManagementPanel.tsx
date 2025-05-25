
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Shield, Activity, TrendingUp } from 'lucide-react';

interface RiskManagementPanelProps {
  department: string;
}

export const RiskManagementPanel: React.FC<RiskManagementPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['risk-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      return data;
    }
  });

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ['risk-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Real-time updates every 5 seconds for fraud monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      refetchTransactions();
      refetchProfiles();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchTransactions, refetchProfiles]);

  // Real-time fraud detection logic
  const getFlaggedTransactions = () => {
    return transactions?.filter(tx => {
      const amount = Math.abs(Number(tx.amount || 0));
      return amount > 500000 || tx.status === 'failed' || tx.type === 'suspicious';
    }) || [];
  };

  const getHighRiskUsers = () => {
    return profiles?.filter(profile => {
      const userTransactions = transactions?.filter(tx => tx.user_id === profile.id) || [];
      const totalAmount = userTransactions.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
      return totalAmount > 1000000 || userTransactions.length > 50;
    }) || [];
  };

  const calculateRiskScore = (userId: string) => {
    const userTransactions = transactions?.filter(tx => tx.user_id === userId) || [];
    const totalAmount = userTransactions.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
    const failedTransactions = userTransactions.filter(tx => tx.status === 'failed').length;
    
    let score = 0;
    if (totalAmount > 1000000) score += 40;
    if (userTransactions.length > 50) score += 30;
    if (failedTransactions > 5) score += 30;
    
    return Math.min(score, 100);
  };

  const flaggedTransactions = getFlaggedTransactions();
  const highRiskUsers = getHighRiskUsers();

  if (transactionsLoading || profilesLoading) {
    return (
      <div className="space-y-4 p-6">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Loading Risk Management Data...</CardTitle>
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
    <div className="space-y-6 p-6">
      {/* Real-time Risk Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Transactions</p>
                <p className="text-2xl font-semibold text-red-600">{flaggedTransactions.length}</p>
                <p className="text-xs text-gray-500 mt-1">Live Monitoring</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Users</p>
                <p className="text-2xl font-semibold text-yellow-600">{highRiskUsers.length}</p>
                <p className="text-xs text-gray-500 mt-1">Requires Review</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">{transactions?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Live Count</p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <p className="text-2xl font-semibold text-green-600">
                  {flaggedTransactions.length > 10 ? 'High' : flaggedTransactions.length > 5 ? 'Medium' : 'Low'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current Status</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Transactions */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="border-b bg-white border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">Flagged Transactions</CardTitle>
          <CardDescription className="text-gray-600">Real-time fraud monitoring and suspicious activity detection</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">User ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Risk Level</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedTransactions.slice(0, 20).map((transaction) => {
                  const amount = Math.abs(Number(transaction.amount || 0));
                  const riskLevel = amount > 1000000 ? 'High' : amount > 500000 ? 'Medium' : 'Low';
                  
                  return (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {transaction.reference}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{transaction.user_id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">₦{amount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={riskLevel === 'High' ? 'destructive' : riskLevel === 'Medium' ? 'secondary' : 'default'}>
                          {riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm" variant="outline">Block</Button>
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

      {/* High Risk Users */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="border-b bg-white border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">High Risk Users</CardTitle>
          <CardDescription className="text-gray-600">Users requiring additional monitoring and verification</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">User</TableHead>
                  <TableHead className="font-semibold text-gray-700">MiraklePay ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Risk Score</TableHead>
                  <TableHead className="font-semibold text-gray-700">Transaction Count</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Volume</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskUsers.slice(0, 20).map((user) => {
                  const userTransactions = transactions?.filter(tx => tx.user_id === user.id) || [];
                  const totalVolume = userTransactions.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
                  const riskScore = calculateRiskScore(user.id);
                  
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{user.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 truncate">{user.phone_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {user.mirackle_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-gray-900">{riskScore}%</div>
                          <Badge variant={riskScore > 70 ? 'destructive' : riskScore > 40 ? 'secondary' : 'default'}>
                            {riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{userTransactions.length}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">₦{totalVolume.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">Monitor</Button>
                          <Button size="sm" variant="outline">Restrict</Button>
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
