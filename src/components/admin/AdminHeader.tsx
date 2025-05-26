
import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Bell, Settings, ChevronDown } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface AdminUser {
  id: string
  email: string
  full_name: string
  department: string
  session_token: string
}

interface AdminHeaderProps {
  adminUser: AdminUser
  onLogout: () => void
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ adminUser, onLogout }) => {
  const getDepartmentColor = (department: string) => {
    const colors = {
      customer_support: "bg-blue-100 text-blue-800",
      compliance: "bg-green-100 text-green-800",
      finance: "bg-purple-100 text-purple-800",
      risk: "bg-red-100 text-red-800",
      operations: "bg-orange-100 text-orange-800",
      marketing: "bg-pink-100 text-pink-800",
      technical: "bg-gray-100 text-gray-800",
      audit: "bg-indigo-100 text-indigo-800",
    }
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">MiraklePay Admin</h1>
            <p className="text-sm text-gray-600">Real-time administration dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 h-auto p-2">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-gray-900">{adminUser.full_name}</div>
                  <Badge className={`text-xs ${getDepartmentColor(adminUser.department)}`}>
                    {adminUser.department.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {adminUser.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {adminUser.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{adminUser.full_name}</p>
                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
