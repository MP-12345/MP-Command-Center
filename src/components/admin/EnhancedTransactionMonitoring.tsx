
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, MoreHorizontal, Eye, Flag, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedTransactionMonitoringProps {
  department: string;
}

export const EnhancedTransactionMonitoring: React.FC<EnhancedTransactionMonitoringProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['enhanced-transactions', department, searchTerm, filterType, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          profiles!inner(full_name, mirackle_id, is_verified)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`reference.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  const getDepartmentColumns = () => {
    const baseColumns = ['Transaction ID', 'User', 'Type', 'Amount', 'Status', 'Date'];
    
    const departmentColumns: Record<string, string[]> = {
      customer_support: [...baseColumns, 'Support Notes', 'Resolution'],
      compliance: [...baseColumns, 'Risk Score', 'Compliance Check', 'Flagged'],
      finance: [...baseColumns, 'Fee', 'Revenue Impact', 'Account Type'],
      risk: [...baseColumns, 'Risk Level', 'ML Score', 'Review Status'],
      operations: [...baseColumns, 'Processing Time', 'System Load', 'Performance'],
      marketing: [...baseColumns, 'Campaign Source', 'Conversion', 'Attribution'],
      technical: [...baseColumns, 'API Response', 'Error Rate', 'Latency'],
      audit: [...baseColumns, 'Audit Trail', 'Compliance', 'Documentation']
    };

    return departmentColumns[department] || baseColumns;
  };

  const formatCurrency = (amount: number) => `₦${Math.abs(amount).toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      cancelled: 'outline'
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.toUpperCase()}
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
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getRiskLevel = (amount: number) => {
    if (amount > 500000) return 'High';
    if (amount > 100000) return 'Medium';
    return 'Low';
  };

  const paginatedTransactions = transactions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Transactions...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
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
              <CardTitle>Transaction Monitoring</CardTitle>
              <CardDescription>
                Monitor and analyze platform transactions - {department.replace('_', ' ')} view
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
                placeholder="Search by transaction ID, reference, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
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
                {paginatedTransactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{transaction.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{transaction.profiles?.mirackle_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    
                    {department === 'compliance' && (
                      <>
                        <TableCell>
                          <Badge variant={getRiskLevel(Math.abs(transaction.amount)) === 'High' ? 'destructive' : 'default'}>
                            {getRiskLevel(Math.abs(transaction.amount))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </TableCell>
                        <TableCell>
                          {Math.abs(transaction.amount) > 500000 ? (
                            <Flag className="w-4 h-4 text-red-600" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </>
                    )}

                    {department === 'finance' && (
                      <>
                        <TableCell>{formatCurrency(transaction.fee || 0)}</TableCell>
                        <TableCell>{formatCurrency((transaction.fee || 0) * 0.8)}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.profiles?.is_verified ? 'default' : 'secondary'}>
                            {transaction.profiles?.is_verified ? 'Verified' : 'Standard'}
                          </Badge>
                        </TableCell>
                      </>
                    )}

                    {department === 'risk' && (
                      <>
                        <TableCell>
                          <Badge variant={getRiskLevel(Math.abs(transaction.amount)) === 'High' ? 'destructive' : 'default'}>
                            {getRiskLevel(Math.abs(transaction.amount))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">0.{Math.floor(Math.random() * 99)}</span>
                        </TableCell>
                        <TableCell>
                          {transaction.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-yellow-600">Review</span>
                          )}
                        </TableCell>
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
                            <Flag className="mr-2 h-4 w-4" />
                            Flag Transaction
                          </DropdownMenuItem>
                          {department === 'risk' && (
                            <DropdownMenuItem className="text-red-600">
                              <Flag className="mr-2 h-4 w-4" />
                              Mark as Suspicious
                            </DropdownMenuItem>
                          )}
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactions?.length || 0)} of {transactions?.length || 0} transactions
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
                disabled={currentPage * itemsPerPage >= (transactions?.length || 0)}
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
