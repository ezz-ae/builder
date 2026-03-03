import Link from "next/link"
import { ALL_WEBSITE_TEMPLATES, WEBSITE_TEMPLATES_COUNT } from "@/components/templates/website-templates"

const TEMPLATE_FEATURES = [
  { title: "Live listings ready", desc: "Your inventory syncs into listings, grids, and AI chats automatically." },
  { title: "Builder-verified", desc: "Every template includes previews and CMS-ready blocks for broker teams." },
  { title: "AI marketing", desc: "Campaigns, SEO copy, and follow-up flows ship preconfigured." },
  { title: "Fully responsive", desc: "Desktop, tablet, and mobile styles tested across every block." },
]

export default function TemplatesPage() {
  const docs = [
    { label: "Live Demos", href: "/showcase" },
    { label: "AI Chat Builder", href: "/ai-chat" },
    { label: "Inventory Feed", href: "/inventory" },
    { label: "Start Building", href: "/builder" },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="px-6 py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">Templates</p>
          <h1 className="text-4xl md:text-5xl font-bold">29+ real estate templates—ready for your listings</h1>
          <p className="text-lg text-gray-600">
            Every suite (all {WEBSITE_TEMPLATES_COUNT}) ships with curated pages, data bindings, and AI copy so you can present verified inventory to clients in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {docs.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className="px-5 py-3 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition"
              >
                {doc.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6 space-y-3 bg-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Builder-ready</p>
            <h2 className="text-3xl font-bold text-slate-900">Customizable, data-bound templates</h2>
            <p className="text-sm text-slate-500">
              Choose a template and the builder will auto-populate grid, hero, and CTA blocks with your listings and media. All colors, fonts, and CTA links stay editable.
            </p>
            <div className="grid gap-3">
              {TEMPLATE_FEATURES.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <span className="text-xs uppercase tracking-[0.4em] text-blue-500">•</span>
                  <div>
                    <p className="font-semibold text-slate-900">{feature.title}</p>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 bg-gradient-to-br from-blue-950 to-slate-900 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300">Live inventory</p>
            <h3 className="text-2xl font-semibold">Inventory sync</h3>
            <p className="text-sm text-white/80">
              Real-time feeds populate the property grids, hero sliders, and dynamic CTAs across all templates.
            </p>
            <ul className="mt-4 list-disc list-inside text-sm space-y-1 text-white/80">
              <li>Filter by status, price, and beds.</li>
              <li>Add listings to any custom section.</li>
              <li>Preview listings before publishing using the builder.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_WEBSITE_TEMPLATES.map((template) => {
            const primaryColor = template.defaultSettings?.colors?.primary ?? "#2563eb"
            const accentColor = template.defaultSettings?.colors?.accent ?? primaryColor
            return (
              <div
                key={template.id}
                className="group rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {template.category ?? "General"}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {template.tags.length} tags
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {template.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-6 pb-6 flex items-center justify-between">
                  <Link
                    href={`/builder?template=${template.id}`}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Use Template
                  </Link>
                  <span className="text-xs text-gray-500">Updated {new Date(template.createdAt ?? Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
