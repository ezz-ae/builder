"use client"

import React, { useEffect, useState } from 'react'

interface StatProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  trend?: number
}

function StatCard({ label, value, prefix, suffix, trend }: StatProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
      <div className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono text-white">
          {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
        {trend !== undefined && (
          <span className={`text-[10px] ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  )
}

export default function RealTimeStats({ stats }: { stats: Record<string, any> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Events" value={stats.total_events || 0} />
      <StatCard label="Avg Rate" value={stats.avg_rate || 0} suffix="/s" />
      <StatCard label="Active Alerts" value={stats.active_alerts || 0} trend={stats.alert_trend} />
      <StatCard label="Uptime" value={stats.uptime || 0} suffix="m" />
    </div>
  )
}
