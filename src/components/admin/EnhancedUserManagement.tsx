
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, Ban } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedUserManagementProps {
  department: string;
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: users, isLoading } = useQuery({
    queryKey: ['enhanced-users', department, searchTerm, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          kyc_verifications(status, verification_type, created_at),
          transactions(amount, type, status, created_at),
          user_limits(*)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,mirackle_id.ilike.%${searchTerm}%`);
      }

      if (filterStatus !== 'all') {
        query = query.eq('is_verified', filterStatus === 'verified');
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  const getDepartmentColumns = () => {
    const baseColumns = ['Name', 'MiraklePay ID', 'Balance', 'Status', 'Joined'];
    
    const departmentColumns: Record<string, string[]> = {
      customer_support: [...baseColumns, 'Support Tickets', 'Last Contact'],
      compliance: [...baseColumns, 'KYC Status', 'Risk Level', 'Documents'],
      finance: [...baseColumns, 'Transaction Volume', 'Fee Revenue', 'Account Type'],
      risk: [...baseColumns, 'Risk Score', 'Flagged Transactions', 'Last Review'],
      operations: [...baseColumns, 'Activity Score', 'System Usage', 'Performance'],
      marketing: [...baseColumns, 'Referrals', 'Campaign Response', 'LTV'],
      technical: [...baseColumns, 'API Usage', 'System Errors', 'Last Login'],
      audit: [...baseColumns, 'Compliance Score', 'Audit Findings', 'Last Audit']
    };

    return departmentColumns[department] || baseColumns;
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getStatusBadge = (isVerified: boolean) => (
    <Badge variant={isVerified ? "default" : "secondary"}>
      {isVerified ? 'Verified' : 'Pending'}
    </Badge>
  );

  const getRiskLevel = (balance: number, transactionCount: number) => {
    if (balance > 1000000 || transactionCount > 100) return 'High';
    if (balance > 100000 || transactionCount > 20) return 'Medium';
    return 'Low';
  };

  const paginatedUsers = users?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Users...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage and monitor platform users - {department.replace('_', ' ')} view
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or MiraklePay ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {getDepartmentColumns().map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{user.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{user.phone_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {user.mirackle_id}
                      </code>
                    </TableCell>
                    <TableCell>{formatCurrency(user.balance)}</TableCell>
                    <TableCell>{getStatusBadge(user.is_verified)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    
                    {department === 'compliance' && (
                      <>
                        <TableCell>
                          <Badge variant={user.kyc_verifications?.length > 0 ? 'default' : 'secondary'}>
                            {user.kyc_verifications?.length > 0 ? 'Submitted' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRiskLevel(user.balance, user.transaction_count) === 'High' ? 'destructive' : 'default'}>
                            {getRiskLevel(user.balance, user.transaction_count)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.kyc_verifications?.length || 0}</TableCell>
                      </>
                    )}

                    {department === 'finance' && (
                      <>
                        <TableCell>{formatCurrency(user.balance * 0.1)}</TableCell>
                        <TableCell>{formatCurrency(user.transaction_count * 50)}</TableCell>
                        <TableCell>
                          <Badge variant={user.balance > 100000 ? 'default' : 'secondary'}>
                            {user.balance > 100000 ? 'Premium' : 'Standard'}
                          </Badge>
                        </TableCell>
                      </>
                    )}

                    {department === 'marketing' && (
                      <>
                        <TableCell>{user.referral_count}</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>{formatCurrency(user.balance * 2.5)}</TableCell>
                      </>
                    )}

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users?.length || 0)} of {users?.length || 0} users
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= (users?.length || 0)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
