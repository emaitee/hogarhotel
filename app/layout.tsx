

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/layout/AppLayout"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}><AppLayout>{children}</AppLayout></body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
