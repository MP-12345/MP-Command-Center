
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Shield, Activity, Clock, Eye, Download, Filter, AlertTriangle } from 'lucide-react';

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

  const { data: adminUsers, isLoading: adminLoading, refetch: refetchAdminUsers } = useQuery({
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
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const { data: adminPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  // Auto-refresh every 10 seconds for live monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAudit();
      refetchAdminUsers();
      refetchSessions();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetchAudit, refetchAdminUsers, refetchSessions]);

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

  const logAdminAction = async (action: string, resourceType: string, resourceId?: string) => {
    try {
      const { data, error } = await supabase.rpc('log_admin_action', {
        p_admin_user_id: 'current_admin_id', // This should be the current admin's ID
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_ip_address: '127.0.0.1' // This should be the actual IP
      });
      
      if (error) throw error;
      refetchAudit();
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  if (auditLoading || adminLoading || sessionsLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-sm border bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Loading Audit Data...</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Audit & Monitoring Center</h1>
              <p className="text-gray-600">Real-time admin activity tracking and security monitoring</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
              <Button variant="outline" className="border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-white border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Audit Logs</p>
                  <p className="text-3xl font-semibold text-gray-900">{auditLogs?.length || 0}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Live Monitoring
                  </div>
                </div>
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Admins</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {adminUsers?.filter(a => a.is_active).length || 0}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Real-time
                  </div>
                </div>
                <Shield className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {adminSessions?.filter(s => new Date(s.expires_at) > new Date()).length || 0}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Live
                  </div>
                </div>
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {auditLogs?.filter(log => 
                      new Date(log.created_at).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Today
                  </div>
                </div>
                <Clock className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Users Status */}
        <Card className="shadow-sm border bg-white">
          <CardHeader className="bg-white border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Admin Users Overview</CardTitle>
                <CardDescription className="text-gray-600">Monitor admin user activities and access status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Admin</TableHead>
                    <TableHead className="font-semibold text-gray-700">Department</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Last Login</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers?.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {admin.full_name.charAt(0)}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900">{admin.full_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {admin.department.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={admin.is_active ? "default" : "destructive"}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-600">
                        {admin.last_login ? 
                          new Date(admin.last_login).toLocaleString() : 
                          'Never'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => logAdminAction('VIEW_ADMIN_DETAILS', 'admin_user', admin.id)}>
                          <Eye className="w-4 h-4 mr-1" />
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

        {/* Audit Trail */}
        <Card className="shadow-sm border bg-white">
          <CardHeader className="bg-white border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Live Audit Trail</CardTitle>
                <CardDescription className="text-gray-600">Real-time monitoring of all administrative actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search audit logs by action, resource, or admin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-base border-gray-300 focus:border-gray-500"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                    <TableHead className="font-semibold text-gray-700">Admin</TableHead>
                    <TableHead className="font-semibold text-gray-700">Action</TableHead>
                    <TableHead className="font-semibold text-gray-700">Resource</TableHead>
                    <TableHead className="font-semibold text-gray-700">Resource ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">IP Address</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="whitespace-nowrap font-mono text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {getAdminName(log.admin_user_id)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)} className="font-medium">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {log.resource_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {log.resource_id?.slice(0, 8) || 'N/A'}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 font-mono">
                          {log.ip_address?.toString() || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => logAdminAction('VIEW_AUDIT_DETAILS', 'audit_log', log.id)}>
                          <Eye className="w-4 h-4 mr-1" />
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
    </div>
  );
};
