
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  Megaphone,
  Settings,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';

interface ModernAdminSidebarProps {
  department: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ModernAdminSidebar: React.FC<ModernAdminSidebarProps> = ({
  department,
  activeSection,
  onSectionChange
}) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null }
    ];

    const departmentItems: Record<string, any[]> = {
      customer_support: [
        { id: 'users', label: 'Customer Support', icon: Users, badge: '12' }
      ],
      compliance: [
        { id: 'kyc', label: 'KYC Verification', icon: Shield, badge: 'New' }
      ],
      finance: [
        { id: 'finance', label: 'Treasury', icon: DollarSign, badge: null },
        { id: 'transactions', label: 'Transactions', icon: CreditCard, badge: '3' }
      ],
      risk: [
        { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle, badge: '!' },
        { id: 'transactions', label: 'Fraud Monitor', icon: CreditCard, badge: null }
      ],
      operations: [
        { id: 'transactions', label: 'Operations', icon: CreditCard, badge: null }
      ],
      marketing: [
        { id: 'marketing', label: 'Campaigns', icon: Megaphone, badge: null }
      ],
      technical: [
        { id: 'technical', label: 'System Support', icon: Settings, badge: null }
      ],
      audit: [
        { id: 'audit', label: 'Audit Logs', icon: FileText, badge: null }
      ]
    };

    return [...baseItems, ...(departmentItems[department] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-white/10 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl">
        <div className="flex items-center space-x-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              MiraklePay
            </h2>
            <p className="text-xs text-blue-200/80 capitalize">
              {department.replace('_', ' ')} Admin
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-xl">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-200/60 text-xs font-medium px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-400/30"
                          : "text-blue-100/80 hover:bg-white/10 hover:text-white hover:shadow-md"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-all duration-300",
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" 
                            : "bg-white/10 group-hover:bg-white/20"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium truncate">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs px-2 py-0.5",
                              item.badge === '!' 
                                ? "bg-red-500/20 text-red-300 border-red-400/30"
                                : item.badge === 'New'
                                ? "bg-green-500/20 text-green-300 border-green-400/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-400/30"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-blue-300" />
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl">
        <div className="p-4 text-center">
          <div className="text-blue-200/60 text-xs space-y-1">
            <p>© 2024 MiraklePay</p>
            <p>Admin Panel v2.0</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">System Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
