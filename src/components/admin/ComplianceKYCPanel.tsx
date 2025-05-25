
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface ComplianceKYCPanelProps {
  department: string;
}

export const ComplianceKYCPanel: React.FC<ComplianceKYCPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['compliance-profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone_number,
          mirackle_id,
          transaction_count,
          is_bank_verified,
          nin_number,
          is_verified,
          created_at,
          bvn,
          waitlist_email,
          preferred_currency,
          username
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,mirackle_id.ilike.%${searchTerm}%,nin_number.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: kycVerifications, isLoading: kycLoading } = useQuery({
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

  const { data: userDocuments, isLoading: documentsLoading } = useQuery({
    queryKey: ['user-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getKYCStatus = (userId: string) => {
    const kyc = kycVerifications?.find(k => k.user_id === userId);
    return kyc?.status || 'pending';
  };

  const getRiskLevel = (profile: any) => {
    let score = 0;
    if (!profile.is_verified) score += 30;
    if (!profile.is_bank_verified) score += 20;
    if (!profile.nin_number) score += 25;
    if (profile.transaction_count > 100) score += 15;
    if (profile.transaction_count > 500) score += 10;

    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const getUserDocuments = (userId: string) => {
    return userDocuments?.filter(doc => doc.user_id === userId).length || 0;
  };

  if (profilesLoading || kycLoading || documentsLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Card className="shadow-sm border bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Loading Compliance Data...</CardTitle>
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{profiles?.length || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KYC Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {kycVerifications?.filter(k => k.status === 'pending').length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KYC Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {kycVerifications?.filter(k => k.status === 'approved').length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{userDocuments?.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border bg-white">
        <CardHeader className="border-b bg-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Compliance & KYC Management</CardTitle>
              <CardDescription className="text-gray-600">Monitor user verification and compliance status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, MiraklePay ID, or NIN..."
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
                  <TableHead className="font-semibold text-gray-700">Verification Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Bank Verified</TableHead>
                  <TableHead className="font-semibold text-gray-700">Transaction Count</TableHead>
                  <TableHead className="font-semibold text-gray-700">Risk Level</TableHead>
                  <TableHead className="font-semibold text-gray-700">KYC Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Documents</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => {
                  const riskLevel = getRiskLevel(profile);
                  const kycStatus = getKYCStatus(profile.id);
                  const documentsCount = getUserDocuments(profile.id);
                  
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
                        <div className="flex items-center space-x-2">
                          {profile.is_verified ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <Badge variant={profile.is_verified ? "default" : "secondary"}>
                            {profile.is_verified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.is_bank_verified ? "default" : "outline"}>
                          {profile.is_bank_verified ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{profile.transaction_count}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            riskLevel === 'High' ? 'destructive' : 
                            riskLevel === 'Medium' ? 'secondary' : 'default'
                          }
                        >
                          {riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <Badge variant={kycStatus === 'approved' ? 'default' : 'secondary'}>
                            {kycStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{documentsCount}</div>
                          <div className="text-xs text-gray-500">Files</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                          <Button size="sm" variant="outline">
                            Verify
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
