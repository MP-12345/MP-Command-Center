
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, Activity, User, Clock } from 'lucide-react';

interface AuditPanelProps {
  department: string;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ department }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: auditLogs, isLoading: auditLoading, refetch: refetchAudit } = useQuery({
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

  const { data: adminUsers, isLoading: adminLoading, refetch: refetchAdmins } = useQuery({
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

  const { data: adminSessions, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Real-time updates every 3 seconds for audit monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAudit();
      refetchAdmins();
      refetchSessions();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetchAudit, refetchAdmins, refetchSessions]);

  const getAdminName = (adminUserId: string) => {
    const admin = adminUsers?.find(a => a.id === adminUserId);
    return admin?.full_name || admin?.email || 'Unknown Admin';
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('suspend')) {
      return 'destructive';
    }
    if (action.toLowerCase().includes('create') || action.toLowerCase().includes('approve')) {
      return 'default';
    }
    return 'secondary';
  };

  if (auditLoading || adminLoading || sessionsLoading) {
    return (
      <div className="space-y-4 p-6">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Loading Audit Data...</CardTitle>
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
    <div className="space-y-6 p-6">
      {/* Live Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Audit Logs</p>
                <p className="text-2xl font-semibold text-gray-900">{auditLogs?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Live Tracking</p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminUsers?.filter(admin => admin.is_active).length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Currently Active</p>
              </div>
              <User className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminSessions?.filter(session => new Date(session.expires_at) > new Date()).length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Live Sessions</p>
              </div>
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Actions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditLogs?.filter(log => 
                    new Date(log.created_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Actions Today</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Audit Logs */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="border-b bg-white border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Live Audit Logs</CardTitle>
              <CardDescription className="text-gray-600">Real-time tracking of all admin activities and system actions</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Export Logs</Button>
              <Button variant="outline">Generate Report</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit logs by action or resource type..."
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
                  <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                  <TableHead className="font-semibold text-gray-700">Admin User</TableHead>
                  <TableHead className="font-semibold text-gray-700">Action</TableHead>
                  <TableHead className="font-semibold text-gray-700">Resource Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Resource ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">IP Address</TableHead>
                  <TableHead className="font-semibold text-gray-700">User Agent</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs?.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {new Date(log.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {getAdminName(log.admin_user_id || '')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{log.resource_type}</span>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {log.resource_id || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 font-mono">
                        {log.ip_address || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 truncate max-w-32">
                        {log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'N/A'}
                      </span>
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
    </div>
  );
};
