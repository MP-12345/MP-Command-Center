
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Bell } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  department: string;
  session_token: string;
}

interface AdminHeaderProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ adminUser, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">MiraklePay Admin Panel</h1>
            <p className="text-sm text-gray-600">Real-time administration dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{adminUser.full_name}</div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {adminUser.department.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
