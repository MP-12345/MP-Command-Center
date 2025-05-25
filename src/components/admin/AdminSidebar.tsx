
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
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  department: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  department,
  activeSection,
  onSectionChange
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard }
    ];

    const departmentItems: Record<string, any[]> = {
      customer_support: [
        { id: 'users', label: 'Customer Management', icon: Users },
        { id: 'transactions', label: 'Transaction Support', icon: CreditCard }
      ],
      compliance: [
        { id: 'kyc', label: 'KYC Verification', icon: Shield },
        { id: 'users', label: 'Compliance Review', icon: Users }
      ],
      finance: [
        { id: 'finance', label: 'Treasury Management', icon: DollarSign },
        { id: 'transactions', label: 'Financial Operations', icon: CreditCard }
      ],
      risk: [
        { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle },
        { id: 'transactions', label: 'Fraud Monitoring', icon: CreditCard }
      ],
      operations: [
        { id: 'users', label: 'Operations Management', icon: Users },
        { id: 'transactions', label: 'Transaction Operations', icon: CreditCard }
      ],
      marketing: [
        { id: 'marketing', label: 'Campaign Management', icon: Megaphone },
        { id: 'users', label: 'User Analytics', icon: Users }
      ],
      technical: [
        { id: 'technical', label: 'System Support', icon: Settings },
        { id: 'users', label: 'Technical Settings', icon: Users }
      ],
      audit: [
        { id: 'audit', label: 'Audit & Monitoring', icon: FileText },
        { id: 'users', label: 'Admin Management', icon: Users }
      ]
    };

    return [...baseItems, ...(departmentItems[department] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">MiraklePay</h2>
                <p className="text-xs text-slate-300 capitalize">{department.replace('_', ' ')} Admin</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-slate-700 p-2"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105"
                  )}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={cn(
                    "transition-all duration-200",
                    isCollapsed ? "w-6 h-6" : "w-5 h-5",
                    activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-center text-slate-400 text-xs">
            <p>© 2024 MiraklePay</p>
            <p>Admin Panel v2.0</p>
          </div>
        </div>
      )}
    </div>
  );
};
