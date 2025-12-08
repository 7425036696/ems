"use client"

import React, { useState, useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Update sidebar open state only when mobile state changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background relative">
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} isMobile={isMobile} />
        
        {/* Mobile Toggle Button (only visible when sidebar is closed) */}
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

        {/* Desktop Toggle Button (optional, or rely on sidebar closing) 
            For now, let's assume desktop users might want to close it too. 
            If closed on desktop, we need a button to open it.
        */}
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
    </SessionProvider>
  )
}
