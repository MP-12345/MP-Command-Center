
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminStats } from "./AdminStats"
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
} from "lucide-react"

interface DashboardOverviewProps {
  department: string
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ department }) => {
  const getDepartmentQuickActions = () => {
    const actions: Record<string, Array<{ icon: any; label: string; description: string; color: string }>> = {
      customer_support: [
        {
          icon: Users,
          label: "Handle Support Tickets",
          description: "Manage customer inquiries",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
          icon: CreditCard,
          label: "Transaction Support",
          description: "Assist with payment issues",
          color: "bg-green-50 text-green-700 border-green-200",
        },
        {
          icon: Shield,
          label: "Account Verification",
          description: "Process KYC requests",
          color: "bg-purple-50 text-purple-700 border-purple-200",
        },
      ],
      compliance: [
        {
          icon: Shield,
          label: "Review KYC Documents",
          description: "Verify customer identities",
          color: "bg-green-50 text-green-700 border-green-200",
        },
        {
          icon: AlertTriangle,
          label: "Risk Assessment",
          description: "Evaluate compliance risks",
          color: "bg-orange-50 text-orange-700 border-orange-200",
        },
        {
          icon: CheckCircle,
          label: "Compliance Reports",
          description: "Generate regulatory reports",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        },
      ],
      finance: [
        {
          icon: DollarSign,
          label: "Treasury Management",
          description: "Monitor platform liquidity",
          color: "bg-green-50 text-green-700 border-green-200",
        },
        {
          icon: TrendingUp,
          label: "Financial Reports",
          description: "Analyze revenue metrics",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
          icon: CreditCard,
          label: "Settlement Operations",
          description: "Process daily settlements",
          color: "bg-purple-50 text-purple-700 border-purple-200",
        },
      ],
      risk: [
        {
          icon: AlertTriangle,
          label: "Risk Assessment",
          description: "Monitor high-risk activities",
          color: "bg-red-50 text-red-700 border-red-200",
        },
        {
          icon: Shield,
          label: "Fraud Detection",
          description: "Investigate suspicious transactions",
          color: "bg-orange-50 text-orange-700 border-orange-200",
        },
        {
          icon: Activity,
          label: "Real-time Monitoring",
          description: "Track system anomalies",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        },
      ],
    }

    return actions[department] || actions.customer_support
  }

  const quickActions = getDepartmentQuickActions()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 capitalize">
            {department.replace("_", " ")} Department - Real-time Analytics & Insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AdminStats department={department} />

      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Access frequently used features for your department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-200 ${action.color}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{action.label}</h4>
                      <p className="text-sm opacity-80 mt-1">{action.description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-60" />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span>System Status</span>
            </CardTitle>
            <CardDescription>Real-time platform health monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">All systems operational</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                Live
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Database connectivity stable</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                99.9%
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Real-time updates active</span>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                <Clock className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last system check:</span>
                <span className="font-medium text-gray-900">2 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
