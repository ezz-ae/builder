"use client"

import React from 'react'
import { AlertCircle, Clock } from 'lucide-react'

interface Alert {
  timestamp: string
  condition: string
  value: any
}

export default function AlertLog({ alerts = [] }: { alerts: Alert[] }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Alert History</span>
        </div>
        <span className="text-[10px] text-white/30">{alerts.length} total</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-none">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-2">
            <Clock className="w-8 h-8 opacity-50" />
            <span className="text-xs">No alerts triggered yet</span>
          </div>
        ) : (
          alerts.slice().reverse().map((alert, i) => (
            <div key={i} className="p-3 bg-white/[0.03] border border-white/5 rounded-lg flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-rose-400 font-bold">{alert.condition}</span>
                <span className="text-[10px] text-white/20">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[10px] text-white/60">
                Threshold exceeded with value: <span className="text-white font-mono">{alert.value}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
