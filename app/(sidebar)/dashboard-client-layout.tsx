"use client"

import React, { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)

    return () => window.removeEventListener("resize", check)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    setIsSidebarOpen(!isMobile)
  }, [isMobile, mounted])

  const toggleSidebar = () => setIsSidebarOpen(v => !v)

  // Avoid rendering Sidebar until mounted (fix skeleton flicker)
  if (!mounted) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 bg-muted animate-pulse" /> 
        <main className="flex-1 p-8">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} isMobile={isMobile} />

      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden bg-background/60 backdrop-blur-md shadow-sm border border-border/20 hover:bg-accent"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {!isSidebarOpen && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-background/60 backdrop-blur-md shadow-sm border border-border/20 hover:bg-accent"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      <main
        className={cn(
          "flex-1 p-8 transition-all duration-300 ease-in-out",
          isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  )
}
