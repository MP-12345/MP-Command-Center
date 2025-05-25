
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Shield, Activity, Clock } from 'lucide-react';

interface AuditPanelProps {
  department: string;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-logs', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    }
  });

  const { data: adminUsers, isLoading: adminLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('last_login', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: adminSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const getAdminName = (adminId: string) => {
    const admin = adminUsers?.find(a => a.id === adminId);
    return admin?.full_name || 'Unknown Admin';
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('DELETE') || action.includes('SUSPEND')) return 'destructive';
    if (action.includes('CREATE') || action.includes('UPDATE')) return 'default';
    if (action.includes('VIEW') || action.includes('SELECT')) return 'secondary';
    return 'outline';
  };

  if (auditLoading || adminLoading || sessionsLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Audit Data...</CardTitle>
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
      {/* Audit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Audit Logs</p>
                <p className="text-2xl font-bold">{auditLogs?.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-2xl font-bold">
                  {adminUsers?.filter(a => a.is_active).length || 0}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold">
                  {adminSessions?.filter(s => new Date(s.expires_at) > new Date()).length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                <p className="text-2xl font-bold">
                  {auditLogs?.filter(log => 
                    new Date(log.created_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Users Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Admin Users Status</CardTitle>
          <CardDescription>Current admin user activities and login status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers?.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="font-semibold">{admin.full_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {admin.department.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? "default" : "destructive"}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {admin.last_login ? 
                        new Date(admin.last_login).toLocaleString() : 
                        'Never'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-lg md:text-xl">Audit Trail</CardTitle>
              <CardDescription>Detailed log of all administrative actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit logs by action or resource..."
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
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Resource ID</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {getAdminName(log.admin_user_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{log.resource_type}</span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                        {log.resource_id?.slice(0, 8) || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.ip_address || 'Unknown'}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
