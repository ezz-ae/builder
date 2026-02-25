"use client"

import React from 'react'
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import MonitoringDashboard from "@/components/dashboard/monitoring/MonitoringDashboard"
import { useSearchParams } from 'next/navigation'

export default function MonitoringPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-sm font-medium text-blue-400 uppercase tracking-[0.2em] mb-2">Systems Intelligence</h2>
          <h1 className="text-4xl font-bold text-white tracking-tight">Real-time Monitoring</h1>
          <p className="text-white/40 mt-2 max-w-xl">
            Visualize autonomous agent activity, track threshold alerts, and monitor global event streams in real-time.
          </p>
        </div>

        <MonitoringDashboard sessionId={sessionId || undefined} />
      </div>
    </DashboardLayout>
  )
}
