
import type React from "react"
import { cn } from "@/lib/utils"
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
  Activity,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

interface AdminSidebarProps {
  department: string
  activeSection: string
  onSectionChange: (section: string) => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ department, activeSection, onSectionChange }) => {
  const getMenuItems = () => {
    const baseItems = [{ id: "overview", label: "Dashboard Overview", icon: LayoutDashboard }]

    const departmentItems: Record<string, any[]> = {
      customer_support: [{ id: "users", label: "Customer Management", icon: Users }],
      compliance: [{ id: "kyc", label: "KYC Verification", icon: Shield }],
      finance: [
        { id: "finance", label: "Treasury Management", icon: DollarSign },
        { id: "transactions", label: "Financial Operations", icon: CreditCard },
      ],
      risk: [
        { id: "risk", label: "Risk Assessment", icon: AlertTriangle },
        { id: "transactions", label: "Fraud Monitoring", icon: CreditCard },
      ],
      operations: [{ id: "transactions", label: "Transaction Operations", icon: CreditCard }],
      marketing: [{ id: "marketing", label: "Campaign Management", icon: Megaphone }],
      technical: [{ id: "technical", label: "System Support", icon: Settings }],
      audit: [{ id: "audit", label: "Audit & Monitoring", icon: FileText }],
    }

    return [...baseItems, ...(departmentItems[department] || [])]
  }

  const menuItems = getMenuItems()

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">MiraklePay</h2>
            <p className="text-sm text-gray-500 capitalize">{department.replace("_", " ")} Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          activeSection === item.id ? "text-white" : "text-gray-500 group-hover:text-gray-700",
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Activity className="w-4 h-4" />
          <span>System Status: Online</span>
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          <p>© MiraklePay Admin v2.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
