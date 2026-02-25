"use client"

import React, { useState, useEffect } from 'react'
import MonitoringHeader from './MonitoringHeader'
import RealTimeStats from './RealTimeStats'
import GeographicMap from './GeographicMap'
import AlertLog from './AlertLog'

interface MonitoringDashboardProps {
  sessionId?: string
}

export default function MonitoringDashboard({ sessionId: initialSessionId }: MonitoringDashboardProps) {
  const [sessionId, setSessionId] = useState(initialSessionId)
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchSession = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/v1/monitoring/sessions/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSessionData(data)
      }
    } catch (err) {
      console.error("Error fetching session:", err)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchSession(sessionId)
      const interval = setInterval(() => fetchSession(sessionId), 2000)
      return () => clearInterval(interval)
    }
  }, [sessionId])

  const handleStart = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:8000/v1/monitoring/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: "Bitcoin Price",
          duration_minutes: 60,
          update_frequency: 1,
          alert_conditions: { "price": 60000 },
          data_source: "mock"
        })
      })
      if (res.ok) {
        const data = await res.json()
        setSessionId(data.id)
      }
    } catch (err) {
      console.error("Error starting session:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    if (!sessionId) return
    try {
      const res = await fetch(`http://localhost:8000/v1/monitoring/sessions/${sessionId}/stop`, {
        method: 'POST'
      })
      if (res.ok) {
        fetchSession(sessionId)
      }
    } catch (err) {
      console.error("Error stopping session:", err)
    }
  }

  // Calculate stats from data points
  const stats = {
    total_events: sessionData?.data_points?.length || 0,
    avg_rate: sessionData?.status === 'running' ? (Math.random() * 5 + 2).toFixed(1) : 0,
    active_alerts: sessionData?.alerts?.length || 0,
    uptime: sessionData ? Math.floor((new Date().getTime() - new Date(sessionData.start_time).getTime()) / 60000) : 0,
    alert_trend: sessionData?.alerts?.length > 0 ? 12 : 0
  }

  // Mock activity points for map
  const activePoints = sessionData?.status === 'running' ? 
    Array.from({ length: 3 }).map(() => ({
      lat: 20 + Math.random() * 50,
      lng: 10 + Math.random() * 80
    })) : []

  return (
    <div className="space-y-6">
      <MonitoringHeader 
        status={sessionData?.status || 'idle'} 
        onStart={handleStart}
        onStop={handleStop}
        title={sessionData?.config?.event_type || "Event Monitor"}
        duration={sessionData?.config?.duration_minutes}
      />
      
      <RealTimeStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        <div className="lg:col-span-2">
          <GeographicMap activePoints={activePoints} />
        </div>
        <div className="lg:col-span-1">
          <AlertLog alerts={sessionData?.alerts || []} />
        </div>
      </div>
    </div>
  )
}
