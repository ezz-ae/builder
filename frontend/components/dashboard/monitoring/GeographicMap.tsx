"use client"

import React, { useMemo } from 'react'

interface Point {
  x: number
  y: number
  opacity: number
  size: number
}

export default function GeographicMap({ activePoints = [] }: { activePoints?: {lat: number, lng: number}[] }) {
  // Generate a dotted world map pattern (mock)
  const dots = useMemo(() => {
    const d: Point[] = []
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 20; j++) {
        // Randomly skip dots to create "continents" look
        if (Math.random() > 0.4) {
          d.push({
            x: i * 2.5,
            y: j * 5,
            opacity: 0.1 + Math.random() * 0.1,
            size: 0.5 + Math.random() * 0.5
          })
        }
      }
    }
    return d
  }, [])

  return (
    <div className="relative w-full aspect-[2/1] bg-black/40 rounded-xl border border-white/5 overflow-hidden group">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
          {/* Static Map Dots */}
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              fill="currentColor"
              className="text-white"
              style={{ opacity: dot.opacity }}
            />
          ))}

          {/* Active Activity Dots */}
          {activePoints.map((point, i) => (
            <g key={`active-${i}`}>
              <circle
                cx={point.lng}
                cy={point.lat}
                r="1"
                fill="#3b82f6"
                className="animate-ping"
              />
              <circle
                cx={point.lng}
                cy={point.lat}
                r="0.5"
                fill="#3b82f6"
              />
            </g>
          ))}
        </svg>
      </div>
      
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Live Activity Map</span>
      </div>
    </div>
  )
}
