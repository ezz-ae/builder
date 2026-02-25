"use client"

import React from 'react'
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PromptLibrary from "@/components/dashboard/prompts/PromptLibrary"

export default function PromptLibraryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-sm font-medium text-purple-400 uppercase tracking-[0.2em] mb-2">Knowledge Assets</h2>
          <h1 className="text-4xl font-bold text-white tracking-tight">Prompts UI Library</h1>
          <p className="text-white/40 mt-2 max-w-xl">
            Access 500+ specialized prompt assets designed for reasoning, creativity, and system safety. Instantly activate advanced agent behaviors.
          </p>
        </div>

        <PromptLibrary />
      </div>
    </DashboardLayout>
  )
}
