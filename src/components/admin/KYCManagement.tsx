
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface KYCManagementProps {
  department: string;
}

export const KYCManagement: React.FC<KYCManagementProps> = ({ department }) => {
  const { data: kycVerifications, isLoading } = useQuery({
    queryKey: ['admin-kyc', department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading KYC data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">KYC Management</h2>
        <p className="text-gray-600">Manage user verification requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KYC Verifications</CardTitle>
          <CardDescription>
            User verification requests requiring review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kycVerifications?.map((kyc) => (
                <TableRow key={kyc.id}>
                  <TableCell className="font-mono text-sm">
                    {kyc.user_id.toString().slice(0, 8)}...
                  </TableCell>
                  <TableCell className="capitalize">{kyc.verification_type}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        kyc.status === 'approved' ? 'default' : 
                        kyc.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {kyc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(kyc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {kyc.status === 'pending' && (
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
