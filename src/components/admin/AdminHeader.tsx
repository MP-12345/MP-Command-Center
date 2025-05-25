
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
    <header className="bg-white shadow-lg border-b border-slate-200 px-4 md:px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Left Section */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{adminUser.full_name}</span>
          </p>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-0 md:mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users, transactions..."
              className="pl-10 border-slate-300 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 rounded-xl">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-xl">
            <Settings className="w-5 h-5 text-slate-600" />
          </Button>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {adminUser.full_name.charAt(0)}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-800">{adminUser.full_name}</div>
              <div className="text-slate-500 capitalize">{adminUser.department.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
