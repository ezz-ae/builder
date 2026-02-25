"use client"

import React, { useState } from 'react'
import { Search, Sparkles, Filter, Brain, Target, MessageSquare, Shield, Clock } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Assets', icon: <Sparkles className="w-3 h-3" /> },
  { id: 'reasoning', label: 'Reasoning', icon: <Brain className="w-3 h-3" /> },
  { id: 'creative', label: 'Creative', icon: <Sparkles className="w-3 h-3" /> },
  { id: 'utility', label: 'Utility', icon: <Target className="w-3 h-3" /> },
  { id: 'safety', label: 'Safety', icon: <Shield className="w-3 h-3" /> },
]

const PROMPT_ASSETS = [
  { id: 1, title: 'Deep Reasoning', category: 'reasoning', description: 'Forces the model to explain every logical step.', color: 'blue' },
  { id: 2, title: 'Ad Variation Expert', category: 'creative', description: 'Specialized in creative hook generation.', color: 'emerald' },
  { id: 3, title: 'Strict Guardrails', category: 'safety', description: 'Prevents specific words or topics.', color: 'rose' },
  { id: 4, title: 'Time Optimizer', category: 'utility', description: 'Focuses on task completion within deadlines.', color: 'amber' },
  { id: 5, title: 'Debate Mode', category: 'reasoning', description: 'Challenges user assumptions with evidence.', color: 'indigo' },
  { id: 6, title: 'Interview Coach', category: 'utility', description: 'Simulates high-pressure interviews.', color: 'purple' },
]

export default function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = PROMPT_ASSETS.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Search 500+ prompt assets..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-white/10 text-white border border-white/10' 
                : 'text-white/30 border border-transparent hover:text-white/50'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(asset => (
          <div key={asset.id} className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${asset.color}-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-${asset.color}-500/10 transition-all`} />
            
            <div className="flex flex-col h-full gap-4">
              <div className="flex justify-between items-start">
                <div className={`p-2 bg-${asset.color}-500/10 rounded-lg text-${asset.color}-400`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-white/10">ASSET-00{asset.id}</div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{asset.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{asset.description}</p>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{asset.category}</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">Activate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
