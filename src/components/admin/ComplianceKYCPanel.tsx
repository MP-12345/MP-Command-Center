
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ComplianceKYCPanelProps {
  department: string;
}

export const ComplianceKYCPanel: React.FC<ComplianceKYCPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ['compliance-profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone_number,
          mirackle_id,
          username,
          waitlist_email,
          transaction_count,
          is_bank_verified,
          nin_number,
          is_verified,
          created_at
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

  const { data: kycVerifications, isLoading: kycLoading, refetch: refetchKyc } = useQuery({
    queryKey: ['kyc-verifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchProfiles();
      refetchKyc();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchProfiles, refetchKyc]);

  const getVerificationStatus = (profile: any) => {
    if (profile.is_verified && profile.is_bank_verified) return 'verified';
    if (profile.nin_number) return 'pending';
    return 'unverified';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'unverified':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (profilesLoading || kycLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Compliance Data...</CardTitle>
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Compliance & KYC Management</h1>
            <p className="text-gray-600">Customer verification and compliance monitoring</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Bulk Verify
            </Button>
            <Button variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Compliance Report
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
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-3xl font-semibold text-green-600">
                  {profiles?.filter(p => p.is_verified).length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-3xl font-semibold text-yellow-600">
                  {profiles?.filter(p => !p.is_verified && p.nin_number).length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="text-3xl font-semibold text-red-600">
                  {profiles?.filter(p => !p.is_verified && !p.nin_number).length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Verification */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle>Customer Verification Status</CardTitle>
              <CardDescription>Monitor and manage customer KYC verification status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Transaction Count</TableHead>
                  <TableHead>Bank Verified</TableHead>
                  <TableHead>NIN Provided</TableHead>
                  <TableHead>Verification Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => {
                  const verificationStatus = getVerificationStatus(profile);
                  
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
                          <div className="text-sm text-gray-600">{profile.phone_number || 'N/A'}</div>
                          {profile.waitlist_email && (
                            <div className="text-sm text-gray-600">{profile.waitlist_email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {profile.mirackle_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{profile.transaction_count || 0}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.is_bank_verified ? "default" : "secondary"}>
                          {profile.is_bank_verified ? 'Verified' : 'Not Verified'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.nin_number ? "default" : "secondary"}>
                          {profile.nin_number ? 'Provided' : 'Not Provided'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(verificationStatus)}>
                          {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          {!profile.is_verified && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                          )}
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
