"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useSidebarStore } from "@/store/sidebarStore"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const { isCollapsed } = useSidebarStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication on mount
    const authenticated = checkAuth()
    if (!authenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [checkAuth, router, pathname])

  // Don't render anything if not authenticated and not on login page
  if (!isAuthenticated && pathname !== "/login") {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={cn("flex-1 flex flex-col transition-all duration-300", isCollapsed ? "ml-16" : "ml-64")}>
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
