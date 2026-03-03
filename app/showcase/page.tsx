import Link from "next/link"
import { PAGE_TEMPLATES, STARTER_WEBSITE } from "@/components/templates/real-estate-pages"

const SHOWCASE_STATS = [
  { label: "Completed pages", value: PAGE_TEMPLATES.length, detail: "Home, listings, about, contact, and tools" },
  { label: "Starter blocks", value: STARTER_WEBSITE.pages[0]?.blocks.length ?? 0, detail: "Fully assembled hero + grid layouts" },
  { label: "Inventory sources", value: "Broker listings + media", detail: "Live inventory powering every grid" },
  { label: "AI touchpoints", value: "Gemini 1.5", detail: "Campaigns, SEO copy, WhatsApp follow-ups" },
]

export default function ShowcasePage() {
  const heroTemplate = STARTER_WEBSITE.pages.find((page) => page.slug === "home")

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-6 py-12 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Full Site Demos</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">See how your listings fill every template</h1>
          <p className="text-lg text-slate-200">
            Watch the builder render live inventory, hero images, and AI-generated marketing copy inside every public page.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/builder" className="px-5 py-3 rounded-full border border-cyan-500 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/10 transition">
              Open Builder
            </Link>
            <Link href="/inventory" className="px-5 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-100 hover:bg-white/10 transition">
              Inventory Feed
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
          {heroTemplate && (
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-8 space-y-4 shadow-2xl">
              <p className="text-sm font-semibold uppercase text-cyan-300">Starter Layout</p>
              <h2 className="text-3xl font-bold">{heroTemplate.title}</h2>
              <p className="text-slate-200">
                {heroTemplate.blocks.length} blocks · {heroTemplate.seo.metaDescription}
              </p>
              <div className="flex gap-3 flex-wrap">
                {heroTemplate.blocks.slice(0, 4).map((block) => (
                  <span key={block.id} className="px-3 py-1 rounded-full bg-white/10 text-xs">
                    {block.blockTemplateId}
                  </span>
                ))}
              </div>
            </article>
          )}

          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 p-8 space-y-4 shadow-2xl">
            <h3 className="text-2xl font-bold">Live data & AI stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {SHOWCASE_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-slate-300 mt-1">{stat.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-300">
              The showcased pages are wired to the same live inventory, media, and campaigns you will use in production.
            </p>
          </article>
        </div>
      </section>

      <section className="px-6 pb-20 space-y-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Page templates in action</h2>
          <p className="text-sm text-slate-400 mb-6">
            Each page blends hero sections, property grids, testimonials, and CTAs bound to the live inventory and AI campaigns.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {PAGE_TEMPLATES.map((page) => (
              <article key={page.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{page.name}</h3>
                    <p className="text-sm text-slate-300">{page.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-200">{page.category}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                  {page.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full border border-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="text-sm text-slate-300 space-y-1">
                  {page.blocks.slice(0, 4).map((block) => (
                    <li key={block.id}>
                      <span className="font-semibold text-white">{block.blockTemplateId}</span>: {block.props?.title ?? "Configured block"}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
