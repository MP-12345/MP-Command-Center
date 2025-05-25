
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Filter, TrendingUp, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface EnhancedTransactionMonitoringProps {
  department: string;
}

export const EnhancedTransactionMonitoring: React.FC<EnhancedTransactionMonitoringProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['enhanced-transactions', statusFilter, typeFilter, searchTerm],
    queryFn: async () => {
      console.log('Fetching transactions from Supabase...');
      let query = supabase
        .from('transactions')
        .select('amount, fee, status, type, reference, created_at, user_id, description')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (searchTerm) {
        query = query.or(`reference.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);
      console.log('Transactions data:', data);
      console.log('Transactions error:', error);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles-for-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, mirackle_id, username');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Real-time updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Refreshing transaction data...');
      refetchTransactions();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetchTransactions]);

  const getUserProfile = (userId: string) => {
    return profiles?.find(p => p.id === userId);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      cancelled: 'outline'
    };
    
    const icons = {
      completed: CheckCircle,
      pending: AlertCircle,
      failed: AlertCircle,
      cancelled: AlertCircle
    };
    
    const Icon = icons[status as keyof typeof icons] || AlertCircle;
    
    return (
      <Badge variant={variants[status] || 'secondary'} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status?.toUpperCase()}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      transfer_in: 'bg-green-100 text-green-800 border-green-200',
      transfer_out: 'bg-red-100 text-red-800 border-red-200',
      deposit: 'bg-blue-100 text-blue-800 border-blue-200',
      withdrawal: 'bg-orange-100 text-orange-800 border-orange-200',
      fee: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {type?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount: number) => `₦${Math.abs(amount).toLocaleString()}`;

  if (transactionsLoading || profilesLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Transaction Data...</CardTitle>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Transaction Monitoring Center</h1>
            <p className="text-gray-600">Real-time transaction monitoring and analysis for {department.replace('_', ' ')} department</p>
          </div>
          {transactionsLoading && (
            <div className="text-sm text-blue-600">
              Loading transactions...
            </div>
          )}
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-3xl font-semibold text-gray-900">{transactions?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Live Count</p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-semibold text-green-600">
                  {transactions?.filter(t => t.status === 'completed').length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Successful</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-semibold text-yellow-600">
                  {transactions?.filter(t => t.status === 'pending').length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">In Progress</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transaction Volume</p>
                <p className="text-3xl font-semibold text-gray-900">
                  ₦{(transactions?.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0) || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Amount</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
          <CardDescription>Search and filter transactions in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by reference, user ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transfer_in">Transfer In</SelectItem>
                <SelectItem value="transfer_out">Transfer Out</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="fee">Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Transaction Data</CardTitle>
          <CardDescription>Real-time transaction monitoring (Updates every 3 seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-700">Reference</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Fee</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => {
                    const customer = getUserProfile(transaction.user_id);
                    
                    return (
                      <TableRow key={transaction.reference} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {customer?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{customer?.full_name || 'Unknown Customer'}</div>
                              <div className="text-sm text-gray-500 truncate">{customer?.mirackle_id || transaction.user_id.slice(0, 8) + '...'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {transaction.reference}
                          </code>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(transaction.type)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Number(transaction.amount))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600">
                            {formatCurrency(Number(transaction.fee || 0))}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 max-w-xs truncate block">
                            {transaction.description || 'No description'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString()}
                            <br />
                            <span className="text-xs text-gray-400">
                              {new Date(transaction.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-gray-500">
                        {transactionsLoading ? 'Loading transactions...' : 'No transactions found'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {transactions && transactions.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {transactions.length} transactions (Live data updates every 3 seconds)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
