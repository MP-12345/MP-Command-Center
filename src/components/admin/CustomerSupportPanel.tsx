
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Phone, Mail, MessageSquare } from 'lucide-react';

interface CustomerSupportPanelProps {
  department: string;
}

export const CustomerSupportPanel: React.FC<CustomerSupportPanelProps> = ({ department }) => {
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

  const getTransactionCount = (userId: string) => {
    return transactions?.filter(t => t.user_id === userId).length || 0;
  };

  const getRecentTransaction = (userId: string) => {
    return transactions?.find(t => t.user_id === userId);
  };

  if (profilesLoading || transactionsLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
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
    <div className="space-y-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-lg md:text-xl">Customer Support Panel</CardTitle>
              <CardDescription>Manage customer inquiries and support requests</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name, phone, or MiraklePay ID..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>MiraklePay ID</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => {
                  const recentTransaction = getRecentTransaction(profile.id);
                  const transactionCount = getTransactionCount(profile.id);
                  
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {profile.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{profile.full_name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500 truncate">{profile.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{profile.phone_number || 'N/A'}</span>
                          </div>
                          {profile.waitlist_email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{profile.waitlist_email}</span>
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
                          <div className="font-semibold">{transactionCount}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {recentTransaction ? (
                          <div>
                            <div className="text-sm font-medium">
                              ₦{Math.abs(recentTransaction.amount).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(recentTransaction.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No activity</span>
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
        </CardContent>
      </Card>
    </div>
  );
};
