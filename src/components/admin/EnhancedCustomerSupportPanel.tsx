
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Phone, Mail, MessageSquare, User, CreditCard, Shield, AlertTriangle, CheckCircle, Eye, Edit, Ban, Unlock } from 'lucide-react';

interface EnhancedCustomerSupportPanelProps {
  department: string;
}

export const EnhancedCustomerSupportPanel: React.FC<EnhancedCustomerSupportPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: profiles, isLoading: profilesLoading } = useQuery({
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

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['customer-support-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, fee, status, type, reference, created_at, user_id, description')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['customer-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const { data: bankAccounts, isLoading: bankAccountsLoading } = useQuery({
    queryKey: ['customer-bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: userSettings, isLoading: userSettingsLoading } = useQuery({
    queryKey: ['customer-user-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  const getTransactionCount = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId).length || 0;
  };

  const getRecentTransaction = (userId: string) => {
    return transactions?.find(t => t.user_id === userId);
  };

  const getUserNotifications = (userId: string) => {
    return notifications?.filter(n => n.user_id === userId).length || 0;
  };

  const getUserBankAccounts = (userId: string) => {
    return bankAccounts?.filter(b => b.user_id === userId).length || 0;
  };

  const handleSuspendUser = async (userId: string) => {
    // Admin action implementation
    console.log('Suspending user:', userId);
  };

  const handleContactUser = async (userId: string) => {
    // Admin action implementation
    console.log('Contacting user:', userId);
  };

  if (profilesLoading || transactionsLoading || notificationsLoading || bankAccountsLoading || userSettingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl font-bold">Loading Customer Support Data...</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Customer Support Center</h1>
              <p className="text-green-100">Comprehensive customer management and support tools</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                <Phone className="w-4 h-4 mr-2" />
                Call Center
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Customers</p>
                  <p className="text-3xl font-bold">{profiles?.length || 0}</p>
                </div>
                <User className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Transactions</p>
                  <p className="text-3xl font-bold">{transactions?.length || 0}</p>
                </div>
                <CreditCard className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Notifications</p>
                  <p className="text-3xl font-bold">{notifications?.length || 0}</p>
                </div>
                <MessageSquare className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Bank Accounts</p>
                  <p className="text-3xl font-bold">{bankAccounts?.length || 0}</p>
                </div>
                <Shield className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Management */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">Customer Management</CardTitle>
                <CardDescription className="text-slate-300">Manage customer accounts, support tickets, and inquiries</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search customers by name, phone, or MiraklePay ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-2 border-slate-200 focus:border-green-500 rounded-xl"
                />
              </div>
            </div>

            <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-700">MiraklePay ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Transactions</TableHead>
                    <TableHead className="font-semibold text-slate-700">Notifications</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles?.map((profile) => {
                    const recentTransaction = getRecentTransaction(profile.id);
                    const transactionCount = getTransactionCount(profile.id);
                    const notificationCount = getUserNotifications(profile.id);
                    
                    return (
                      <TableRow key={profile.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {profile.full_name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate">{profile.full_name || 'Unknown'}</div>
                              <div className="text-sm text-slate-500 truncate">{profile.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-slate-600">{profile.phone_number || 'N/A'}</span>
                            </div>
                            {profile.waitlist_email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-slate-600">{profile.waitlist_email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                            {profile.mirackle_id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold text-slate-800">{transactionCount}</div>
                            <div className="text-xs text-slate-500">Total</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold text-slate-800">{notificationCount}</div>
                            <div className="text-xs text-slate-500">Active</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.biometric_enabled ? "default" : "secondary"} className={profile.biometric_enabled ? "bg-green-100 text-green-800" : ""}>
                            {profile.biometric_enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => handleContactUser(profile.id)} className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleSuspendUser(profile.id)} className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
