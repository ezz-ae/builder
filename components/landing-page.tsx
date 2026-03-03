"use client"

import { ALL_WEBSITE_TEMPLATES } from "./templates/website-templates"
import { ALL_BLOCK_TEMPLATES } from "./templates/block-registry"
import {
  Layers,
  Paintbrush,
  Globe,
  Zap,
  ArrowRight,
  Building2,
  LayoutGrid,
  Smartphone,
  Activity,
  Server,
  ShieldCheck,
  Database,
} from "lucide-react"

const CATEGORIES = [
  { key: "luxury", label: "Luxury", color: "#d4af37" },
  { key: "mainstream", label: "Mainstream", color: "#2563eb" },
  { key: "specialized", label: "Specialized", color: "#7c3aed" },
  { key: "industry", label: "Industry", color: "#059669" },
]

const STATUS_METRICS = [
  {
    label: "Neon tables audited",
    value: "127",
    detail: "159K total rows, 85 populated with Mashroi/PF data",
    color: "from-slate-900 to-slate-800",
    icon: Database,
  },
  {
    label: "Core inventory rows",
    value: "7,015",
    detail: "inventory_full + entrestate_master ready for publishing",
    color: "from-cyan-900 to-blue-900",
    icon: Activity,
  },
  {
    label: "PF gallery health",
    value: "100%",
    detail: "PF hero images + CDN verified across every project",
    color: "from-emerald-900 to-green-900",
    icon: ShieldCheck,
  },
  {
    label: "GC projects synced",
    value: "954",
    detail: "Pulled from gc_projects, known difference vs spine count",
    color: "from-purple-900 to-indigo-900",
    icon: Server,
  },
]

const PUBLIC_EXPERIENCES = [
  {
    title: "Template Gallery",
    description: "Browse 29+ curated templates organized by use cases so you can launch faster.",
    href: "/templates",
    badge: "New",
  },
  {
    title: "Full Site Showcases",
    description: "Preview full home, listings, and about pages assembled from builder-ready templates.",
    href: "/showcase",
    badge: "Demos",
  },
  {
    title: "AI Chat Builder",
    description: "Feed any property and Gemini will create ad copy, follow-ups, and SEO-ready descriptions.",
    href: "/ai-chat",
    badge: "AI",
  },
  {
    title: "Market Analysis",
    description: "Generate market metrics and insights from Neon inventory data.",
    href: "/market-analysis",
    badge: "Insights",
  },
]

export function LandingPage() {
  const templateCount = ALL_WEBSITE_TEMPLATES.length
  const blockCount = ALL_BLOCK_TEMPLATES.length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SiteBuilder</span>
          </div>
          <a
            href="/builder"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
          >
            Start Building
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            {templateCount} Templates &middot; {blockCount}+ Blocks
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Stunning Real Estate
            <br />
            <span className="text-blue-600">Websites in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Choose from professionally designed templates, customize every block,
            and publish your real estate website — no coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition border border-gray-200"
            >
              View Templates
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            A complete website builder tailored specifically for real estate professionals
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: LayoutGrid,
                title: "Drag & Drop Builder",
                desc: "Add, remove, and reorder blocks to create your perfect layout",
              },
              {
                icon: Paintbrush,
                title: "Full Customization",
                desc: "Change colors, fonts, text, and images — make it yours",
              },
              {
                icon: Layers,
                title: `${blockCount}+ Blocks`,
                desc: "Listings grids, hero sections, contact forms, testimonials & more",
              },
              {
                icon: Smartphone,
                title: "Mobile Responsive",
                desc: "Every template looks great on desktop, tablet, and mobile",
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status dashboard */}
      <section className="py-12 px-6 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-300 mb-1">Status Dashboard</p>
              <h2 className="text-3xl font-bold">Mashroi + PF ecosystem is live</h2>
            </div>
            <a
              href="/inventory"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white text-slate-900 text-sm font-semibold shadow-lg shadow-cyan-500/30"
            >
              View inventory feed
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STATUS_METRICS.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${metric.color} p-5 shadow-2xl shadow-black/30`}
              >
                <div className="flex items-center justify-between">
                  <metric.icon className="w-5 h-5 text-white/70" />
                  <span className="text-xs uppercase tracking-[0.3em] text-white/70">{metric.label}</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-white">{metric.value}</p>
                <p className="text-sm text-white/80 mt-2">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Professional Templates
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Start with a professionally designed template and customize it to match your brand
          </p>

          {/* Category pills */}
          <div className="flex justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => {
              const count = ALL_WEBSITE_TEMPLATES.filter(
                (t) => (t as Record<string, unknown>).category === cat.key
              ).length
              return (
                <span
                  key={cat.key}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.label} ({count})
                </span>
              )
            })}
          </div>

          {/* Template grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_WEBSITE_TEMPLATES.slice(0, 6).map((template) => {
              const primary = template.defaultSettings?.colors?.primary || "#2563eb"
              const secondary = template.defaultSettings?.colors?.secondary || primary
              return (
              <div
                key={template.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group"
              >
                <div
                  className="h-40 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${primary}22, ${secondary}33)`,
                  }}
                >
                  <Globe
                    className="w-12 h-12 opacity-30"
                    style={{ color: primary }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <a
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse All {templateCount} Templates
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.45em] text-blue-600 font-semibold">Public experiences</p>
            <h2 className="text-3xl font-bold text-gray-900">Dive into the full site experience</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore the same templates, AI chat, and ready-made pages your clients will see once they publish.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PUBLIC_EXPERIENCES.map((experience) => (
              <a
                key={experience.title}
                href={experience.href}
                className="block rounded-2xl border border-gray-100 p-6 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">{experience.badge}</span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-3">{experience.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{experience.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Website?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join hundreds of real estate professionals who trust SiteBuilder
            for their online presence.
          </p>
          <a
            href="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} SiteBuilder. Built for real estate professionals.</p>
      </footer>
    </div>
  )
}
