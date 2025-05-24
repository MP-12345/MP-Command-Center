
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  adminUser: {
    full_name: string;
    email: string;
    department: string;
  };
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ adminUser, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back, {adminUser.full_name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{adminUser.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
