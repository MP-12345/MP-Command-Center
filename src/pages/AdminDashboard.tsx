
import { useState, useEffect } from "react"
import { AdminLogin } from "@/components/admin/AdminLogin"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import { DashboardOverview } from "./DashboardOverview"
import { UserManagement } from "./UserManagement"
import { TransactionMonitoring } from "./TransactionMonitoring"
import { KYCManagement } from "./KYCManagement"
import { FinanceManagement } from "./FinanceManagement"
import { RiskManagement } from "./RiskManagement"
import { MarketingManagement } from "./MarketingManagement"
import { TechnicalSupport } from "./TechnicalSupport"
import { AuditLogs } from "./AuditLogs"
import { EnhancedCustomerSupportPanel } from "./EnhancedCustomerSupportPanel"
import { useToast } from "@/hooks/use-toast"
import { SidebarProvider } from "@/components/ui/sidebar"

interface AdminUser {
  id: string
  email: string
  full_name: string
  department: string
  session_token: string
}

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [activeSection, setActiveSection] = useState("overview")
  const { toast } = useToast()

  // Check for existing session on load
  useEffect(() => {
    const savedSession = localStorage.getItem("admin_session")
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        setAdminUser(session)
      } catch (error) {
        localStorage.removeItem("admin_session")
      }
    }
  }, [])

  const handleLogin = (user: AdminUser) => {
    setAdminUser(user)
    localStorage.setItem("admin_session", JSON.stringify(user))
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.full_name}`,
    })
  }

  const handleLogout = () => {
    setAdminUser(null)
    localStorage.removeItem("admin_session")
    setActiveSection("overview")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  const renderContent = () => {
    if (!adminUser) return null

    switch (activeSection) {
      case "overview":
        return <DashboardOverview department={adminUser.department} />
      case "users":
        if (adminUser.department === "customer_support") {
          return <EnhancedCustomerSupportPanel department={adminUser.department} />
        }
        return <UserManagement department={adminUser.department} />
      case "transactions":
        return <TransactionMonitoring department={adminUser.department} />
      case "kyc":
        return <KYCManagement department={adminUser.department} />
      case "finance":
        return <FinanceManagement department={adminUser.department} />
      case "risk":
        return <RiskManagement department={adminUser.department} />
      case "marketing":
        return <MarketingManagement department={adminUser.department} />
      case "technical":
        return <TechnicalSupport department={adminUser.department} />
      case "audit":
        return <AuditLogs department={adminUser.department} />
      default:
        return <DashboardOverview department={adminUser.department} />
    }
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <AdminLogin onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 flex w-full">
        <AdminSidebar
          department={adminUser.department}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader adminUser={adminUser} onLogout={handleLogout} />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminDashboard
