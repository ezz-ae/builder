"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"

type MarketMetrics = Array<{ label: string; value: string; trend?: string }>

type MarketInsights = {
  marketTrend: string
  averagePrice: number
  priceRange: { min: number; max: number }
  populationGrowth: number
  averageDaysOnMarket: number
  schoolRating?: number
  crimeRate?: string
  walkscore?: number
  topNeighborhoodTraits: string[]
}

type ListingAnalysis = {
  pricePerSqft: number
  priceHistory: Array<{ date: string; price: number }>
  marketTrend: "up" | "stable" | "down"
  daysOnMarket: number
  priceReduction?: number
  similarListings: number
  investmentScore?: number
  insights: string[]
}

type ApiResponse = {
  marketInsights: MarketInsights
  listingAnalysis: ListingAnalysis | null
  marketMetrics: MarketMetrics
}

export default function MarketAnalysisPage() {
  const [address, setAddress] = useState("Downtown Dubai, UAE")
  const [price, setPrice] = useState("2500000")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage(null)

    try {
      const params = new URLSearchParams({ address })
      if (price.trim() !== "") {
        params.set("price", price)
      }
      const response = await fetch(`/api/market-analysis?${params.toString()}`)
      const payload = await response.json()
      if (!payload.success) {
        setStatus("error")
        setErrorMessage(payload.error ?? "Failed to load market analysis")
        return
      }
      setData(payload.data)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage((error as Error).message ?? "Failed to load market analysis")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">Market analysis</p>
          <h1 className="text-4xl font-bold">Turn Neon data into market-ready insights</h1>
          <p className="text-lg text-slate-300">
            Use this analysis in your templates or drop the Market Metrics block into any builder page.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/builder" className="px-5 py-3 rounded-full border border-white/30 text-sm font-semibold text-white hover:bg-white/10 transition">
              Open builder
            </Link>
            <Link href="/inventory" className="px-5 py-3 rounded-full border border-white/30 text-sm font-semibold text-white hover:bg-white/10 transition">
              Inventory feed
            </Link>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm text-slate-300 space-y-2">
              <span className="font-semibold text-white">Address or neighborhood</span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300 space-y-2">
              <span className="font-semibold text-white">Listing price (optional)</span>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-cyan-500 font-semibold text-sm uppercase tracking-[0.3em] text-slate-950 hover:bg-cyan-400 transition"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading..." : "Generate analysis"}
          </button>
          {status === "error" && <p className="text-sm text-rose-300">{errorMessage}</p>}
        </form>

        {data && (
          <section className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              {data.marketMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  {metric.trend && <p className="text-xs text-cyan-300">{metric.trend}</p>}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Area insights</h2>
              <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Market trend</p>
                  <p>{data.marketInsights.marketTrend}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Average days on market</p>
                  <p>{data.marketInsights.averageDaysOnMarket} days</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Population growth</p>
                  <p>{data.marketInsights.populationGrowth}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Walkscore</p>
                  <p>{data.marketInsights.walkscore ?? "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Top neighborhood traits</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.marketInsights.topNeighborhoodTraits.map((trait) => (
                    <span key={trait} className="px-3 py-1 rounded-full bg-white/10 text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {data.listingAnalysis && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                <h3 className="text-xl font-semibold">Listing analysis</h3>
                <p className="text-sm text-slate-300">
                  {data.listingAnalysis.insights[0] ?? "Price analysis available for the selected listing."}
                </p>
                <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Price / sqft</p>
                    <p>{data.listingAnalysis.pricePerSqft}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Days on market</p>
                    <p>{data.listingAnalysis.daysOnMarket}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Investment score</p>
                    <p>{data.listingAnalysis.investmentScore ?? "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
