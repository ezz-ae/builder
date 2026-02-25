"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Sparkles, Target, Layers } from 'lucide-react'

const STEPS = [
  "Select Winner",
  "Extract Intent",
  "Variation Space",
  "Reality Check",
  "Generate Packs",
  "Review & Approve",
  "Export Complete"
]

export default function AdsWorkflow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaign, setCampaign] = useState<any>(null)

  const next = () => setCurrentStep(s => Math.min(s + 1, STEPS.length))
  const prev = () => setCurrentStep(s => Math.max(s - 1, 1))

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12 px-4 overflow-x-auto scrollbar-none pb-4">
        {STEPS.map((step, i) => {
          const stepNum = i + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep
          
          return (
            <div key={step} className="flex items-center group">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 
                  isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : 
                  'border-white/10 text-white/30'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{stepNum}</span>}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold whitespace-nowrap ${
                  isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-white/20'
                }`}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-[2px] mx-2 mb-6 ${isCompleted ? 'bg-emerald-500/50' : 'bg-white/5'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 min-h-[500px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-blue-500" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Select Winning Creative</h2>
                  <p className="text-white/40">Choose an existing ad to use as the base for new variations.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <span className="text-xs font-medium text-white/60">Creative #{i}</span>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-video bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/[0.04] transition-all cursor-pointer">
                    <div className="p-2 bg-white/5 rounded-full"><Layers className="w-5 h-5 text-white/30" /></div>
                    <span className="text-xs text-white/30 font-medium">New Campaign</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Extract Creative Intent</h2>
                  <p className="text-white/40">Define the core non-negotiables for this ad variation.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Core Message</label>
                    <textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none h-24" placeholder="What is the main thing the user should take away?" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Promise to Viewer</label>
                      <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="What benefit are we promising?" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Proof / Evidence</label>
                      <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="How do we prove it works?" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Define Variation Space</h2>
                  <p className="text-white/40">Configure the flexible dimensions for AI to explore.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                  {["Hook", "Actor", "Environment", "Format", "Pacing", "Script", "Voiceover", "On-Screen Text"].map(axis => (
                    <div key={axis} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">{axis}</span>
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-4 bg-blue-500/20 rounded-full relative">
                          <div className="absolute left-1 top-1 w-2 h-2 bg-blue-500 rounded-full" />
                        </div>
                        <span className="text-[10px] text-blue-400 font-mono">LOCKED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 flex flex-col items-center justify-center py-10">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Reality Check Passed</h2>
                <p className="text-white/40 max-w-sm text-center">Creative non-negotiables are consistent with the defined variation space.</p>
                <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl w-full max-w-md">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/20 font-bold mb-4 px-2">
                    <span>Dimension</span>
                    <span>Status</span>
                  </div>
                  <div className="space-y-2">
                    {["Core Logic", "Brand Safety", "Technical Feasibility"].map(t => (
                      <div key={t} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-lg">
                        <span className="text-xs text-white/60">{t}</span>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6 flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <Sparkles className="w-20 h-20 text-blue-500 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                </div>
                <h2 className="text-2xl font-bold text-white">Generating Variations</h2>
                <p className="text-white/40">LocalAgent is processing creative packs using your local models.</p>
                <div className="w-full max-w-md bg-white/5 h-1.5 rounded-full overflow-hidden mt-8">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    className="h-full bg-blue-500"
                  />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mt-2">70% COMPLETE</span>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Review & Approve</h2>
                  <p className="text-white/40">Select the variations you want to finalize for export.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                      <div className="w-24 aspect-square bg-white/5 rounded-xl" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">Variation #{i}</h4>
                        <p className="text-[10px] text-white/30 mt-1">Hook: Direct Problem Statement</p>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">APPROVE</button>
                          <button className="px-3 py-1 bg-white/5 text-white/30 text-[10px] font-bold rounded-lg">REJECT</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6 flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Export Complete</h2>
                <p className="text-white/40">3 variations have been successfully processed and saved.</p>
                <button className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all">
                  DOWNLOAD ALL ASSETS
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
          <button 
            onClick={prev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button 
            onClick={next}
            disabled={currentStep === STEPS.length}
            className="flex items-center gap-2 px-8 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
