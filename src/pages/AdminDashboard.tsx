
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { UserManagement } from '@/components/admin/UserManagement';
import { TransactionMonitoring } from '@/components/admin/TransactionMonitoring';
import { KYCManagement } from '@/components/admin/KYCManagement';
import { FinanceManagement } from '@/components/admin/FinanceManagement';
import { RiskManagement } from '@/components/admin/RiskManagement';
import { MarketingManagement } from '@/components/admin/MarketingManagement';
import { TechnicalSupport } from '@/components/admin/TechnicalSupport';
import { AuditLogs } from '@/components/admin/AuditLogs';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  department: string;
  session_token: string;
}

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const savedSession = localStorage.getItem('admin_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setAdminUser(session);
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const handleLogin = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('admin_session', JSON.stringify(user));
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.full_name}`,
    });
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_session');
    setActiveSection('overview');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const renderContent = () => {
    if (!adminUser) return null;

    switch (activeSection) {
      case 'overview':
        return <DashboardOverview department={adminUser.department} />;
      case 'users':
        return <UserManagement department={adminUser.department} />;
      case 'transactions':
        return <TransactionMonitoring department={adminUser.department} />;
      case 'kyc':
        return <KYCManagement department={adminUser.department} />;
      case 'finance':
        return <FinanceManagement department={adminUser.department} />;
      case 'risk':
        return <RiskManagement department={adminUser.department} />;
      case 'marketing':
        return <MarketingManagement department={adminUser.department} />;
      case 'technical':
        return <TechnicalSupport department={adminUser.department} />;
      case 'audit':
        return <AuditLogs department={adminUser.department} />;
      default:
        return <DashboardOverview department={adminUser.department} />;
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        department={adminUser.department}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          adminUser={adminUser}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
