"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSidebarStore } from "@/store/sidebarStore"
import {
  LayoutDashboard,
  Calendar,
  Bed,
  UserCheck,
  UserX,
  Users,
  UserPlus,
  BrushIcon as Broom,
  CreditCard,
  Calculator,
  UserCog,
  UsersRound,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  name: string
  href: string
  icon: any
}

interface MenuGroup {
  name: string
  items: MenuItem[]
  defaultOpen?: boolean
}

const menuGroups: MenuGroup[] = [
  {
    name: "Overview",
    defaultOpen: true,
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    name: "Front Office",
    defaultOpen: true,
    items: [
      { name: "Reservations", href: "/reservations", icon: Calendar },
      { name: "Rooms", href: "/rooms", icon: Bed },
      { name: "Check In", href: "/check-in", icon: UserCheck },
      { name: "Check Out", href: "/check-out", icon: UserX },
    ],
  },
  {
    name: "Guest Management",
    items: [
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Guest Registry", href: "/guests", icon: UserPlus },
    ],
  },
  {
    name: "Operations",
    items: [{ name: "Housekeeping", href: "/housekeeping", icon: Broom }],
  },
  {
    name: "Financial",
    items: [
      { name: "Billing", href: "/billing", icon: CreditCard },
      { name: "Accounting", href: "/accounting", icon: Calculator },
    ],
  },
  {
    name: "Human Resources",
    items: [
      { name: "HR Management", href: "/hr", icon: UserCog },
      { name: "Staff Directory", href: "/staff", icon: UsersRound },
    ],
  },
  {
    name: "Analytics",
    items: [{ name: "Reports", href: "/reports", icon: BarChart3 }],
  },
  {
    name: "System",
    items: [{ name: "Settings", href: "/settings", icon: Settings }],
  },
]

export default function Sidebar() {
  const { isCollapsed } = useSidebarStore()
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    menuGroups.filter((group) => group.defaultOpen).map((group) => group.name),
  )

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((name) => name !== groupName) : [...prev, groupName],
    )
  }

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: 80 }}
        className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 bg-[#1B2A41] rounded-lg flex items-center justify-center">
            <Bed className="h-5 w-5 text-white" />
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {menuGroups
            .flatMap((group) => group.items)
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-lg transition-colors group relative",
                    isActive
                      ? "bg-[#1B2A41] text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </Link>
              )
            })}
        </nav>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ width: 80 }}
      animate={{ width: 280 }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#1B2A41] rounded-lg flex items-center justify-center">
            <Bed className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">HotelPro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.name)

          return (
            <div key={group.name} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <span>{group.name}</span>
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                            isActive
                              ? "bg-[#1B2A41] text-white"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>
    </motion.div>
  )
}
