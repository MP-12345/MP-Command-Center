
import React from 'react';
import { AdminStats } from '@/components/admin/AdminStats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Shield, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  Zap,
  Globe
} from 'lucide-react';

interface DashboardOverviewProps {
  department: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ department }) => {
  const getDepartmentQuickActions = () => {
    const actions = {
      customer_support: [
        {
          icon: Users,
          label: "Handle Support Tickets",
          description: "Manage customer inquiries",
          color: "bg-blue-50 text-blue-700 border-blue-200"
        },
        {
          icon: CreditCard,
          label: "Transaction Support",
          description: "Assist with payment issues",
          color: "bg-green-50 text-green-700 border-green-200"
        },
        {
          icon: Shield,
          label: "Account Verification",
          description: "Process KYC requests",
          color: "bg-purple-50 text-purple-700 border-purple-200"
        }
      ],
      compliance: [
        {
          icon: Shield,
          label: "Review KYC Documents",
          description: "Verify customer identities",
          color: "bg-green-50 text-green-700 border-green-200"
        },
        {
          icon: AlertTriangle,
          label: "Risk Assessment",
          description: "Evaluate compliance risks",
          color: "bg-orange-50 text-orange-700 border-orange-200"
        },
        {
          icon: CheckCircle,
          label: "Compliance Reports",
          description: "Generate regulatory reports",
          color: "bg-blue-50 text-blue-700 border-blue-200"
        }
      ],
      finance: [
        {
          icon: DollarSign,
          label: "Treasury Management",
          description: "Monitor platform liquidity",
          color: "bg-green-50 text-green-700 border-green-200"
        },
        {
          icon: TrendingUp,
          label: "Financial Reports",
          description: "Analyze revenue metrics",
          color: "bg-blue-50 text-blue-700 border-blue-200"
        },
        {
          icon: CreditCard,
          label: "Settlement Operations",
          description: "Process daily settlements",
          color: "bg-purple-50 text-purple-700 border-purple-200"
        }
      ],
      risk: [
        {
          icon: AlertTriangle,
          label: "Risk Assessment",
          description: "Monitor high-risk activities",
          color: "bg-red-50 text-red-700 border-red-200"
        },
        {
          icon: Shield,
          label: "Fraud Detection",
          description: "Investigate suspicious transactions",
          color: "bg-orange-50 text-orange-700 border-orange-200"
        },
        {
          icon: Activity,
          label: "Real-time Monitoring",
          description: "Track system anomalies",
          color: "bg-blue-50 text-blue-700 border-blue-200"
        }
      ]
    };

    return actions[department] || actions.customer_support;
  };

  const quickActions = getDepartmentQuickActions();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 capitalize flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>{department.replace('_', ' ')} Department - Real-time Analytics & Insights</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge 
            variant="outline" 
            className="bg-green-50/80 text-green-700 border-green-200 backdrop-blur-sm px-3 py-1"
          >
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Live Data
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80 transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Stats Component */}
      <AdminStats department={department} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Quick Actions Card */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Access frequently used features</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100/50 hover:from-gray-50 hover:to-white hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                      {action.label}
                    </h4>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* System Status Card */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600">Real-time platform monitoring</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "All systems operational", status: "online", uptime: "99.9%" },
              { label: "Database connectivity", status: "online", uptime: "100%" },
              { label: "Payment processing", status: "online", uptime: "99.8%" },
              { label: "Real-time updates", status: "online", uptime: "100%" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-100/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100/80 text-green-700 text-xs">
                    {item.uptime}
                  </Badge>
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Last Update</p>
                <p className="text-xs text-gray-500">2 seconds ago</p>
              </div>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
