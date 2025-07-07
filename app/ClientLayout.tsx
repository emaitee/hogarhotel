"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/layout/AppLayout"

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return <>{isLoginPage ? children : <AppLayout>{children}</AppLayout>}</>
}
