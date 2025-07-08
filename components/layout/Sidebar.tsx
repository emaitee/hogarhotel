"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/sidebarStore"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Users,
  Bed,
  Calendar,
  UserCheck,
  LogOut,
  CreditCard,
  FileText,
  Settings,
  Building,
  ClipboardList,
  DollarSign,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Hotel,
  Menu,
  X,
  Receipt,
  TrendingUp,
  FileBarChart,
  BookOpen,
  Target,
  Banknote,
  UserCog,
  Clock,
  Award,
} from "lucide-react"

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface MenuGroup {
  title: string
  items: MenuItem[]
  defaultOpen?: boolean
}

const menuGroups: MenuGroup[] = [
  {
    title: "Overview",
    defaultOpen: true,
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Front Office",
    defaultOpen: true,
    items: [
      { title: "Rooms", href: "/rooms", icon: Bed },
      { title: "Reservations", href: "/reservations", icon: Calendar },
      { title: "Check-in", href: "/check-in", icon: UserCheck },
      { title: "Check-out", href: "/check-out", icon: LogOut },
    ],
  },
  {
    title: "Guest Management",
    defaultOpen: false,
    items: [
      { title: "Guests", href: "/guests", icon: Users },
      { title: "Customer Service", href: "/customers", icon: UserPlus },
    ],
  },
  {
    title: "Operations",
    defaultOpen: false,
    items: [
      { title: "Housekeeping", href: "/housekeeping", icon: ClipboardList },
      { title: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
  {
    title: "Financial",
    defaultOpen: false,
    items: [
      { title: "Accounting Overview", href: "/accounting", icon: DollarSign },
      { title: "Chart of Accounts", href: "/accounting/chart-of-accounts", icon: BookOpen },
      { title: "Transactions", href: "/accounting/transactions", icon: Receipt },
      { title: "Expenses", href: "/accounting/expenses", icon: TrendingUp },
      { title: "Financial Reports", href: "/accounting/reports", icon: FileBarChart },
      { title: "Budget Management", href: "/accounting/budget", icon: Target },
      { title: "Tax Management", href: "/accounting/tax", icon: Banknote },
    ],
  },
  {
    title: "Human Resources",
    defaultOpen: false,
    items: [
      { title: "HR Overview", href: "/hr", icon: UserCog },
      { title: "Employees", href: "/hr/employees", icon: Users },
      { title: "Attendance", href: "/hr/attendance", icon: Clock },
      { title: "Leave Management", href: "/hr/leave", icon: Calendar },
      { title: "Payroll", href: "/hr/payroll", icon: DollarSign },
      { title: "Performance", href: "/hr/performance", icon: Award },
    ],
  },
  {
    title: "Analytics",
    defaultOpen: false,
    items: [
      { title: "Reports", href: "/reports", icon: FileText },
      { title: "Staff", href: "/staff", icon: Building },
    ],
  },
  {
    title: "System",
    defaultOpen: false,
    items: [{ title: "Settings", href: "/settings", icon: Settings }],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebarStore()
  const { user } = useAuthStore()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    menuGroups.reduce(
      (acc, group) => ({
        ...acc,
        [group.title]: group.defaultOpen || false,
      }),
      {},
    ),
  )

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }))
  }

  // Auto-expand parent menu if child is active
  useEffect(() => {
    menuGroups.forEach((group) => {
      const hasActiveChild = group.items.some((item) => pathname.startsWith(item.href))
      if (hasActiveChild && !openGroups[group.title]) {
        setOpenGroups((prev) => ({
          ...prev,
          [group.title]: true,
        }))
      }
    })
  }, [pathname, openGroups])

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-[#1B2A41]" />
              <span className="text-xl font-bold text-[#1B2A41]">HotelPro</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={toggle} className="h-8 w-8 p-0">
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {menuGroups.map((group) => (
              <Collapsible
                key={group.title}
                open={openGroups[group.title]}
                onOpenChange={() => toggleGroup(group.title)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{group.title}</span>
                        {openGroups[group.title] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                    {isCollapsed && <div className="h-2 w-2 rounded-full bg-gray-400" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                            isActive && "bg-[#1B2A41] text-white hover:bg-[#1B2A41]/90 hover:text-white",
                            isCollapsed ? "justify-center px-2" : "pl-6",
                          )}
                        >
                          <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                          {!isCollapsed && item.title}
                        </Button>
                      </Link>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>

        {/* User Info */}
        {user && !isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1B2A41] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
