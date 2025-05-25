
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Phone, Mail, MessageSquare, User, CreditCard, Eye, Ban, TrendingUp } from 'lucide-react';

interface CustomerSupportPanelProps {
  department: string;
}

export const CustomerSupportPanel: React.FC<CustomerSupportPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');

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
    queryKey: ['customer-support-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, fee, status, type, reference, created_at, user_id, description')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      return data;
    }
  });

  // Real-time updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
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

  const getUserProfile = (userId: string) => {
    return profiles?.find(p => p.id === userId);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (profilesLoading || transactionsLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Customer Support Data...</CardTitle>
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Customer Support Center</h1>
            <p className="text-gray-600">Comprehensive customer management and transaction support</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Center
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-semibold text-gray-900">{profiles?.length || 0}</p>
              </div>
              <User className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-3xl font-semibold text-gray-900">{transactions?.length || 0}</p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {profiles?.filter(p => p.biometric_enabled).length || 0}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-400" />
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
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="flex border-b">
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
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>MiraklePay ID</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Last Transaction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles?.map((profile) => {
                      const recentTransaction = getRecentTransaction(profile.id);
                      const transactionCount = getTransactionCount(profile.id);
                      
                      return (
                        <TableRow key={profile.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {profile.full_name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{profile.full_name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{profile.username}</div>
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
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
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
                            {recentTransaction ? (
                              <div>
                                <div className="text-sm font-medium">
                                  ₦{Math.abs(Number(recentTransaction.amount)).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(recentTransaction.created_at).toLocaleDateString()}
                                </div>
                                <Badge variant={getStatusBadgeVariant(recentTransaction.status)} className="text-xs">
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
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Contact
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Monitoring</h3>
                <p className="text-gray-600">Advanced transaction monitoring and analysis for customer support</p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Customer</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.map((transaction) => {
                      const customer = getUserProfile(transaction.user_id);
                      
                      return (
                        <TableRow key={transaction.reference} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {customer?.full_name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{customer?.full_name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{customer?.mirackle_id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {transaction.reference}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ₦{Math.abs(Number(transaction.amount)).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-600">
                              ₦{Number(transaction.fee || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{transaction.description || 'N/A'}</span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {new Date(transaction.created_at).toLocaleString()}
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
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
