import Link from "next/link"
import { InventoryPreview } from "@/components/inventory-preview"

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="px-6 py-16">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-blue-600 font-semibold">Inventory Feed</p>
          <h1 className="text-4xl md:text-5xl font-bold">Wire the Neon inventory directly to your site</h1>
          <p className="text-lg text-slate-500">
            Pull live data from Neon’s Mashroi inventory tables and display it on any landing page, template, or custom block.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/templates" className="px-5 py-3 rounded-full border border-blue-500 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition">
              Browse templates
            </Link>
            <Link href="/builder" className="px-5 py-3 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Open builder
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-8 pb-20">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Neon audit</p>
              <h2 className="text-2xl font-bold text-slate-900">inventory_full + PF data</h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">127 tables ✓</span>
          </div>
          <p className="text-sm text-slate-500">
            Use `/api/inventory` to stream the `inventory_full` or `entrestaet_master` data into any page. The builder already surfaces these rows inside the template selector so you can drop an inventory section onto your site instantly.
          </p>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs font-mono text-slate-600">
            <p className="text-slate-800 font-semibold mb-2">API sample</p>
            <code className="block mb-1">GET /api/inventory?limit=12&status=active</code>
            <code className="block">GET /api/inventory?agencyId=mashroi-agency&status=pf-ready</code>
          </div>
        </section>

        <InventoryPreview limit={8} />

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 p-6 space-y-3 bg-white shadow-sm">
            <h3 className="text-lg font-semibold">Builder inventory listing</h3>
            <p className="text-sm text-slate-500">
              The Template Builder surfaces these rows alongside every template so you can preview which listings will populate the grids before publishing. Use the “inventory pull” block to embed them directly.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 p-6 space-y-3 bg-white shadow-sm">
            <h3 className="text-lg font-semibold">Embed anywhere</h3>
            <p className="text-sm text-slate-500">
              Fetch `/api/inventory` from client or server code. Iterate over the JSON payload, render cards, or feed it to your dynamic grid component. Want to export? Use the same endpoint inside the builder’s custom block to power live property carousels.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}
