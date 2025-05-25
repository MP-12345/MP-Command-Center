
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Settings, Shield, Smartphone, Wifi } from 'lucide-react';

interface TechnicalSupportPanelProps {
  department: string;
}

export const TechnicalSupportPanel: React.FC<TechnicalSupportPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['technical-profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone_number,
          mirackle_id,
          web3_wallet_initialized,
          web3_mnemonic_created,
          web3_wallet_address,
          biometric_enabled,
          login_pin_enabled,
          created_at,
          updated_at
        `)
        .order('updated_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,mirackle_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: web3Transactions, isLoading: web3Loading } = useQuery({
    queryKey: ['web3-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('web3_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const { data: webauthnCredentials, isLoading: webauthnLoading } = useQuery({
    queryKey: ['webauthn-credentials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webauthn_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getWeb3TransactionCount = (userId: string) => {
    return web3Transactions?.filter(tx => tx.user_id === userId).length || 0;
  };

  const hasWebauthnCredentials = (userId: string) => {
    return webauthnCredentials?.some(cred => cred.user_id === userId) || false;
  };

  const getTechnicalStatus = (profile: any) => {
    let issues = 0;
    if (!profile.web3_wallet_initialized) issues++;
    if (!profile.biometric_enabled) issues++;
    if (!profile.login_pin_enabled) issues++;
    
    if (issues === 0) return 'Excellent';
    if (issues === 1) return 'Good';
    if (issues === 2) return 'Fair';
    return 'Needs Attention';
  };

  if (profilesLoading || web3Loading || webauthnLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Technical Support Data...</CardTitle>
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
      {/* Technical Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Web3 Wallets</p>
                <p className="text-2xl font-bold">
                  {profiles?.filter(p => p.web3_wallet_initialized).length || 0}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Biometric Users</p>
                <p className="text-2xl font-bold">
                  {profiles?.filter(p => p.biometric_enabled).length || 0}
                </p>
              </div>
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Web3 Transactions</p>
                <p className="text-2xl font-bold">{web3Transactions?.length || 0}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Keys</p>
                <p className="text-2xl font-bold">{webauthnCredentials?.length || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-lg md:text-xl">Technical Support Panel</CardTitle>
              <CardDescription>Monitor user technical configurations and Web3 operations</CardDescription>
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
                  <TableHead>Web3 Wallet</TableHead>
                  <TableHead>Biometric</TableHead>
                  <TableHead>Login PIN</TableHead>
                  <TableHead>Web3 TXs</TableHead>
                  <TableHead>Security Keys</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => {
                  const web3TxCount = getWeb3TransactionCount(profile.id);
                  const hasWebauthn = hasWebauthnCredentials(profile.id);
                  const status = getTechnicalStatus(profile);
                  
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
                        <div className="flex items-center space-x-2">
                          <Badge variant={profile.web3_wallet_initialized ? "default" : "outline"}>
                            {profile.web3_wallet_initialized ? 'Initialized' : 'Not Setup'}
                          </Badge>
                          {profile.web3_wallet_address && (
                            <span className="text-xs text-gray-500">
                              {profile.web3_wallet_address.slice(0, 6)}...
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.biometric_enabled ? "default" : "secondary"}>
                          {profile.biometric_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.login_pin_enabled ? "default" : "secondary"}>
                          {profile.login_pin_enabled ? 'Set' : 'Not Set'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold">{web3TxCount}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={hasWebauthn ? "default" : "outline"}>
                          {hasWebauthn ? 'Active' : 'None'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            status === 'Excellent' ? 'default' : 
                            status === 'Good' ? 'secondary' : 
                            status === 'Fair' ? 'outline' : 'destructive'
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">
                            Diagnose
                          </Button>
                          <Button size="sm" variant="outline">
                            Support
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
