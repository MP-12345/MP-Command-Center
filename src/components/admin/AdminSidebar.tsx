
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
  FileText
} from 'lucide-react';

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
  const getMenuItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard }
    ];

    const departmentItems: Record<string, any[]> = {
      customer_support: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'transactions', label: 'Transactions', icon: CreditCard }
      ],
      compliance: [
        { id: 'kyc', label: 'KYC Management', icon: Shield },
        { id: 'users', label: 'User Profiles', icon: Users }
      ],
      finance: [
        { id: 'finance', label: 'Finance & Treasury', icon: DollarSign },
        { id: 'transactions', label: 'Transactions', icon: CreditCard }
      ],
      risk: [
        { id: 'risk', label: 'Risk Management', icon: AlertTriangle },
        { id: 'transactions', label: 'Transactions', icon: CreditCard }
      ],
      operations: [
        { id: 'users', label: 'Operations', icon: Users },
        { id: 'transactions', label: 'Transactions', icon: CreditCard }
      ],
      marketing: [
        { id: 'marketing', label: 'Marketing', icon: Megaphone },
        { id: 'users', label: 'User Analytics', icon: Users }
      ],
      technical: [
        { id: 'technical', label: 'Technical Support', icon: Settings },
        { id: 'users', label: 'User Settings', icon: Users }
      ],
      audit: [
        { id: 'audit', label: 'Audit Logs', icon: FileText },
        { id: 'users', label: 'Admin Management', icon: Users }
      ]
    };

    return [...baseItems, ...(departmentItems[department] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">MiraklePay Admin</h2>
        <p className="text-sm text-gray-600 capitalize">{department.replace('_', ' ')}</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
