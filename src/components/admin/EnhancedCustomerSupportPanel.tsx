
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Phone, Mail, MessageSquare, User, CreditCard, Eye, Ban, Filter, ArrowUpDown } from 'lucide-react';

interface EnhancedCustomerSupportPanelProps {
  department: string;
}

export const EnhancedCustomerSupportPanel: React.FC<EnhancedCustomerSupportPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ['customer-support-profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone_number,
          mirackle_id,
          username,
          avatar_url,
          preferred_currency,
          referred_by,
          referral_count,
          points,
          card_waitlist,
          created_at,
          updated_at,
          waitlist_email,
          biometric_enabled,
          login_pin_enabled,
          auto_save_percentage,
          web3_wallet_initialized,
          web3_mnemonic_created
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%,mirackle_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    }
  });

  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['customer-support-transactions', transactionFilter, statusFilter],
    queryFn: async () => {
      console.log('Fetching transactions from Supabase...');
      let query = supabase
        .from('transactions')
        .select('amount, fee, status, type, reference, created_at, user_id, description')
        .order('created_at', { ascending: false });

      if (transactionFilter !== 'all') {
        query = query.eq('type', transactionFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.limit(500);
      console.log('Transactions data:', data);
      console.log('Transactions error:', error);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Real-time updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Refreshing data...');
      refetchProfiles();
      refetchTransactions();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetchProfiles, refetchTransactions]);

  const getTransactionCount = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId).length || 0;
  };

  const getRecentTransaction = (userId: string) => {
    return transactions?.find(t => t.user_id === userId);
  };

  const getTotalTransactionAmount = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId)
      .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0) || 0;
  };

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
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      transfer_in: 'bg-green-100 text-green-800',
      transfer_out: 'bg-red-100 text-red-800',
      deposit: 'bg-blue-100 text-blue-800',
      withdrawal: 'bg-orange-100 text-orange-800',
      fee: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
      }`}>
        {type?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount: number) => `₦${Math.abs(amount).toLocaleString()}`;

  const handleSuspendUser = async (userId: string) => {
    console.log('Suspending user:', userId);
    // Implementation for suspending user
  };

  const handleContactUser = async (userId: string) => {
    console.log('Contacting user:', userId);
    // Implementation for contacting user
  };

  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-900">Loading Customer Support Data...</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Customer Support Center</h1>
              <p className="text-gray-600">Comprehensive customer management and support tools</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-300">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
              <Button variant="outline" className="border-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                Call Center
              </Button>
            </div>
          </div>
        </div>

        {/* Live Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-semibold text-gray-900">{profiles?.length || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Live Count</p>
                </div>
                <User className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
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

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {profiles?.filter(p => p.biometric_enabled).length || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Biometric Enabled</p>
                </div>
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transaction Volume</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    ₦{(transactions?.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0) || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Amount</p>
                </div>
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 font-medium ${activeTab === 'customers' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Customer Management
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-3 font-medium ${activeTab === 'transactions' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Transaction Monitoring
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'customers' && (
              <>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search customers by name, phone, or MiraklePay ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-3 text-base border-gray-300 focus:border-gray-500"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-700">MiraklePay ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Transactions</TableHead>
                        <TableHead className="font-semibold text-gray-700">Transaction Volume</TableHead>
                        <TableHead className="font-semibold text-gray-700">Last Transaction</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles?.map((profile) => {
                        const recentTransaction = getRecentTransaction(profile.id);
                        const transactionCount = getTransactionCount(profile.id);
                        const totalVolume = getTotalTransactionAmount(profile.id);
                        
                        return (
                          <TableRow key={profile.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {profile.full_name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-gray-900 truncate">{profile.full_name || 'Unknown'}</div>
                                  <div className="text-sm text-gray-500 truncate">{profile.username}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{profile.phone_number || 'N/A'}</span>
                                </div>
                                {profile.waitlist_email && (
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{profile.waitlist_email}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                                {profile.mirackle_id}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{transactionCount}</div>
                                <div className="text-xs text-gray-500">Total</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-gray-900">
                                ₦{totalVolume.toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {recentTransaction ? (
                                <div>
                                  <div className="text-sm font-medium">
                                    ₦{Math.abs(Number(recentTransaction.amount)).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(recentTransaction.created_at).toLocaleDateString()}
                                  </div>
                                  <Badge variant={recentTransaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                    {recentTransaction.status}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-gray-400">No transactions</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={profile.biometric_enabled ? "default" : "secondary"}>
                                {profile.biometric_enabled ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex space-x-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => handleContactUser(profile.id)}>
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Contact
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleSuspendUser(profile.id)}>
                                  <Ban className="w-4 h-4 mr-1" />
                                  Suspend
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {activeTab === 'transactions' && (
              <>
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Monitoring</h3>
                      <p className="text-gray-600">Advanced transaction monitoring and analysis for customer support department</p>
                    </div>
                    {transactionsLoading && (
                      <div className="text-sm text-blue-600">
                        Loading transactions...
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Filters */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="transfer_in">Transfer In</SelectItem>
                      <SelectItem value="transfer_out">Transfer Out</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
