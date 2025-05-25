
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Shield, Activity, Clock, Eye, Download, Filter } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl font-bold">Loading Audit Data...</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Audit & Monitoring Center</h1>
              <p className="text-blue-100">Real-time admin activity tracking and security monitoring</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Audit Logs</p>
                  <p className="text-3xl font-bold">{auditLogs?.length || 0}</p>
                </div>
                <FileText className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Admins</p>
                  <p className="text-3xl font-bold">
                    {adminUsers?.filter(a => a.is_active).length || 0}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Sessions</p>
                  <p className="text-3xl font-bold">
                    {adminSessions?.filter(s => new Date(s.expires_at) > new Date()).length || 0}
                  </p>
                </div>
                <Activity className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Today's Activities</p>
                  <p className="text-3xl font-bold">
                    {auditLogs?.filter(log => 
                      new Date(log.created_at).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Users Status */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">Admin Users Overview</CardTitle>
                <CardDescription className="text-slate-300">Monitor admin user activities and access status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Admin</TableHead>
                    <TableHead className="font-semibold text-slate-700">Department</TableHead>
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Last Login</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers?.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {admin.full_name.charAt(0)}
                          </div>
                          <div className="font-semibold text-slate-800">{admin.full_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {admin.department.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={admin.is_active ? "default" : "destructive"} className={admin.is_active ? "bg-green-100 text-green-800" : ""}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-slate-600">
                        {admin.last_login ? 
                          new Date(admin.last_login).toLocaleString() : 
                          'Never'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
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
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">Live Audit Trail</CardTitle>
                <CardDescription className="text-slate-300">Real-time monitoring of all administrative actions</CardDescription>
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
                  className="pl-10 py-3 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Timestamp</TableHead>
                    <TableHead className="font-semibold text-slate-700">Admin</TableHead>
                    <TableHead className="font-semibold text-slate-700">Action</TableHead>
                    <TableHead className="font-semibold text-slate-700">Resource</TableHead>
                    <TableHead className="font-semibold text-slate-700">Resource ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">IP Address</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="whitespace-nowrap font-mono text-sm text-slate-600">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">
                          {getAdminName(log.admin_user_id)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)} className="font-medium">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {log.resource_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                          {log.resource_id?.slice(0, 8) || 'N/A'}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 font-mono">
                          {log.ip_address?.toString() || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
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
