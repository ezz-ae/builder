"use client"

import { useEffect, useState } from "react"
import type { InventoryItem } from "@/components/types"

interface InventoryPreviewProps {
  limit?: number
}

export function InventoryPreview({ limit = 6 }: InventoryPreviewProps) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadInventory() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/inventory?limit=${limit}`, {
          signal: controller.signal,
        })
        const json = await response.json()
        if (!json.success) {
          throw new Error(json.error ?? "Failed to fetch inventory")
        }
        setItems(json.data ?? [])
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Inventory preview load failed", err)
          setError("Unable to load inventory preview.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadInventory()

    return () => controller.abort()
  }, [limit])

  return (
    <section className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Inventory feed</p>
          <h3 className="text-lg font-semibold text-white">Live inventory feed</h3>
        </div>
        <span className="text-xs rounded-full border border-slate-800 px-3 py-1 text-slate-300">Ready to embed</span>
      </div>

      {loading && <p className="text-sm text-slate-400">Fetching inventory...</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.slice(0, limit).map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/5 bg-white/5 p-3 space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">{item.status ?? "Active"}</p>
              <h4 className="text-sm font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap">
                {item.propertyName}
              </h4>
              <p className="text-xs text-slate-300">{item.address}</p>
              <p className="text-sm text-cyan-300 font-semibold">
                ${item.price.toLocaleString()}
                {item.beds && ` · ${item.beds} bd`}
                {item.baths && ` · ${item.baths} ba`}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Use this feed to power listings across your pages and templates.
      </p>
    </section>
  )
}
