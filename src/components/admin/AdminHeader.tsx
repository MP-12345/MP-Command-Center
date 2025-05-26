
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Bell, Settings, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';

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
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MiraklePay Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Real-time administration & monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:bg-white/80 transition-all duration-300"
            />
          </div>

          {/* Notifications */}
          <Button 
            variant="outline" 
            size="sm"
            className="relative bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-white/80 transition-all duration-300"
          >
            <Bell className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/60">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900">{adminUser.full_name}</div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200/60"
                >
                  {adminUser.department.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Settings */}
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-white/80 transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          {/* Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="text-red-600 border-red-200/60 hover:bg-red-50/80 bg-white/50 backdrop-blur-sm transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
