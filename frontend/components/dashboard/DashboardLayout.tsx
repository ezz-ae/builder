"use client"

import { useState } from "react"
import { useAgentStore } from "@/lib/store/agent-store"
import { useRouter } from "next/navigation"
import DashboardSidebar from "./DashboardSidebar"
import ActionSearchBar from "../ActionSearchBar"
import RemoteChat from "../RemoteChat"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  const { isSidebarCollapsed, setSidebarCollapsed, sessionId } = useAgentStore((state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    setSidebarCollapsed: state.setSidebarCollapsed,
    sessionId: state.sessionId
  }))

  const handleNavigate = (route: string) => {
    if (route === "overview") router.push("/dashboard")
    else router.push(`/dashboard/${route}`)
  }

  return (
    <div className="flex h-screen w-full bg-[#080808]">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Command Bar (Floating at top) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
          <ActionSearchBar 
            onNavigate={handleNavigate}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none pt-20">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* Chat Overlay */}
        <RemoteChat 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          sessionId={sessionId || undefined}
        />
      </main>
    </div>
  )
}
