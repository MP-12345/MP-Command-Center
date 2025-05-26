
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CreditCard,
  Shield,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface AdminStatsProps {
  department: string
}

export const AdminStats: React.FC<AdminStatsProps> = ({ department }) => {
  // Mock data - in real app, this would come from your API
  const mockStats = {
    totalUsers: 12543,
    totalTransactions: 8921,
    pendingKYC: 45,
    totalRewards: 234,
    totalFees: 125000,
    verifiedUsers: 11234,
    totalBalance: 2500000,
  }

  const getStatsForDepartment = () => {
    const baseStats = [
      {
        title: "Total Users",
        value: mockStats.totalUsers.toLocaleString(),
        icon: Users,
        description: "Registered users",
        trend: "+12%",
        isPositive: true,
        color: "bg-blue-50 border-blue-200",
      },
    ]

    const departmentStats: Record<string, any[]> = {
      customer_support: [
        {
          title: "Active Transactions",
          value: mockStats.totalTransactions.toLocaleString(),
          icon: CreditCard,
          description: "Total transactions",
          trend: "+8%",
          isPositive: true,
          color: "bg-green-50 border-green-200",
        },
        {
          title: "Support Tickets",
          value: "45",
          icon: FileText,
          description: "Open tickets",
          trend: "-5%",
          isPositive: true,
          color: "bg-orange-50 border-orange-200",
        },
        {
          title: "Response Time",
          value: "2.3m",
          icon: Activity,
          description: "Average response",
          trend: "-15%",
          isPositive: true,
          color: "bg-purple-50 border-purple-200",
        },
      ],
      compliance: [
        {
          title: "Pending KYC",
          value: mockStats.pendingKYC.toString(),
          icon: Shield,
          description: "Awaiting verification",
          trend: "+3%",
          isPositive: false,
          color: "bg-yellow-50 border-yellow-200",
        },
        {
          title: "Verified Users",
          value: mockStats.verifiedUsers.toLocaleString(),
          icon: Users,
          description: "KYC approved",
          trend: "+15%",
          isPositive: true,
          color: "bg-green-50 border-green-200",
        },
        {
          title: "Compliance Score",
          value: "98.5%",
          icon: Shield,
          description: "Overall compliance",
          trend: "+2%",
          isPositive: true,
          color: "bg-blue-50 border-blue-200",
        },
      ],
      finance: [
        {
          title: "Total Balance",
          value: `₦${mockStats.totalBalance.toLocaleString()}`,
          icon: DollarSign,
          description: "Platform balance",
          trend: "+22%",
          isPositive: true,
          color: "bg-green-50 border-green-200",
        },
        {
          title: "Total Fees",
          value: `₦${mockStats.totalFees.toLocaleString()}`,
          icon: TrendingUp,
          description: "Collected fees",
          trend: "+18%",
          isPositive: true,
          color: "bg-blue-50 border-blue-200",
        },
        {
          title: "Daily Volume",
          value: "₦2.1M",
          icon: CreditCard,
          description: "Transaction volume",
          trend: "+25%",
          isPositive: true,
          color: "bg-purple-50 border-purple-200",
        },
      ],
      risk: [
        {
          title: "Risk Alerts",
          value: "12",
          icon: AlertTriangle,
          description: "High risk transactions",
          trend: "+2%",
          isPositive: false,
          color: "bg-red-50 border-red-200",
        },
        {
          title: "Flagged Accounts",
          value: "8",
          icon: Shield,
          description: "Under review",
          trend: "-10%",
          isPositive: true,
          color: "bg-orange-50 border-orange-200",
        },
        {
          title: "Risk Score",
          value: "2.1/10",
          icon: Activity,
          description: "Platform risk level",
          trend: "-5%",
          isPositive: true,
          color: "bg-green-50 border-green-200",
        },
      ],
    }

    return [...baseStats, ...(departmentStats[department] || [])]
  }

  const departmentStats = getStatsForDepartment()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {departmentStats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.isPositive ? ArrowUpRight : ArrowDownRight

        return (
          <Card
            key={index}
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${stat.color}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                <Icon className="h-4 w-4 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">{stat.description}</p>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium flex items-center space-x-1 ${
                    stat.isPositive
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{stat.trend}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
