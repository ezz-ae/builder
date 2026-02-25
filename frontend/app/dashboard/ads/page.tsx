"use client"

import React from 'react'
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AdsWorkflow from "@/components/dashboard/ads/AdsWorkflow"

export default function AdsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-sm font-medium text-emerald-400 uppercase tracking-[0.2em] mb-2">Content Orchestration</h2>
          <h1 className="text-4xl font-bold text-white tracking-tight">AI Ads Creation</h1>
          <p className="text-white/40 mt-2 max-w-xl">
            Leverage multi-modal models to generate creative variations, extract core intent, and batch-produce high-performing ad variations.
          </p>
        </div>

        <AdsWorkflow />
      </div>
    </DashboardLayout>
  )
}
