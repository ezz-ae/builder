"use client"

import React from 'react'
import { Play, Square, Settings, Activity } from 'lucide-react'

interface MonitoringHeaderProps {
  status: string
  onStart: () => void
  onStop: () => void
  title: string
  duration?: number
}

export default function MonitoringHeader({ status, onStart, onStop, title, duration }: MonitoringHeaderProps) {
  const isRunning = status === 'running'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isRunning ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/30'}`}>
          <Activity className={`w-6 h-6 ${isRunning ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
          <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="capitalize">{status}</span>
            {duration && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>Duration: {duration}m</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all text-sm font-medium"
          >
            <Square className="w-4 h-4" />
            Stop Monitoring
          </button>
        ) : (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Session
          </button>
        )}
        <button className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white border border-white/5 rounded-xl transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
