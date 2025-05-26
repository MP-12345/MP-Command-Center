
import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
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
import { EnhancedCustomerSupportPanel } from '@/components/admin/EnhancedCustomerSupportPanel';
import { ModernAdminSidebar } from '@/components/admin/ModernAdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';

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
        if (adminUser.department === 'customer_support') {
          return <EnhancedCustomerSupportPanel department={adminUser.department} />;
        }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="relative z-10">
          <AdminLogin onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex w-full">
        <ModernAdminSidebar 
          department={adminUser.department}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader 
            adminUser={adminUser}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-slate-100/50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
