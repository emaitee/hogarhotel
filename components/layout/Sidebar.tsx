"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/sidebarStore"
import { useAuthStore } from "@/store/authStore"
import {
  Home,
  Users,
  Bed,
  Calendar,
  UserCheck,
  UserX,
  CreditCard,
  BarChart3,
  Settings,
  ChevronRight,
  Building2,
  ClipboardList,
  Calculator,
  Receipt,
  FileText,
  Banknote,
  UserCog,
  Clock,
  Award,
  DollarSign,
  Target,
  BookOpen,
} from "lucide-react"

interface MenuItem {
  title: string
  href?: string
  icon: any
  children?: MenuItem[]
  roles?: string[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: Bed,
  },
  {
    title: "Reservations",
    href: "/reservations",
    icon: Calendar,
  },
  {
    title: "Guests",
    href: "/guests",
    icon: Users,
  },
  {
    title: "Check-in",
    href: "/check-in",
    icon: UserCheck,
  },
  {
    title: "Check-out",
    href: "/check-out",
    icon: UserX,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Housekeeping",
    href: "/housekeeping",
    icon: ClipboardList,
  },
  {
    title: "Accounting",
    icon: Calculator,
    children: [
      {
        title: "Overview",
        href: "/accounting",
        icon: BarChart3,
      },
      {
        title: "Chart of Accounts",
        href: "/accounting/chart-of-accounts",
        icon: BookOpen,
      },
      {
        title: "Transactions",
        href: "/accounting/transactions",
        icon: Receipt,
      },
      {
        title: "Expenses",
        href: "/accounting/expenses",
        icon: DollarSign,
      },
      {
        title: "Financial Reports",
        href: "/accounting/reports",
        icon: FileText,
      },
      {
        title: "Budget Management",
        href: "/accounting/budget",
        icon: Target,
      },
      {
        title: "Tax Management",
        href: "/accounting/tax",
        icon: Banknote,
      },
    ],
  },
  {
    title: "HR Management",
    icon: UserCog,
    children: [
      {
        title: "Overview",
        href: "/hr",
        icon: BarChart3,
      },
      {
        title: "Employees",
        href: "/hr/employees",
        icon: Users,
      },
      {
        title: "Attendance",
        href: "/hr/attendance",
        icon: Clock,
      },
      {
        title: "Leave Management",
        href: "/hr/leave",
        icon: Calendar,
      },
      {
        title: "Payroll",
        href: "/hr/payroll",
        icon: DollarSign,
      },
      {
        title: "Performance",
        href: "/hr/performance",
        icon: Award,
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Staff",
    href: "/staff",
    icon: Building2,
    roles: ["Admin", "Manager"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["Admin"],
  },
]

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebarStore()
  const { user } = useAuthStore()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Auto-expand parent menu if child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => child.href && pathname.startsWith(child.href))
        if (hasActiveChild && !expandedItems.includes(item.title)) {
          setExpandedItems((prev) => [...prev, item.title])
        }
      }
    })
  }, [pathname])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isItemVisible = (item: MenuItem) => {
    if (!item.roles) return true
    return user && item.roles.includes(user.role)
  }

  const isActive = (href?: string) => {
    if (!href) return false
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!isItemVisible(item)) return null

    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const itemIsActive = isActive(item.href)

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "text-gray-700 dark:text-gray-300",
              level > 0 && "ml-4",
            )}
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              {!isCollapsed && <span>{item.title}</span>}
            </div>
            {!isCollapsed && (
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {isExpanded && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-6 mt-1 space-y-1">
                  {item.children?.map((child) => renderMenuItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    return (
      <Link
        key={item.title}
        href={item.href!}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1",
          itemIsActive
            ? "bg-[#1B2A41] text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
          level > 0 && "ml-4",
        )}
      >
        <item.icon className="h-5 w-5 mr-3" />
        {!isCollapsed && <span>{item.title}</span>}
      </Link>
    )
  }

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#1B2A41] rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Hotel PMS</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</div>
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">{user.name.charAt(0)}</span>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
