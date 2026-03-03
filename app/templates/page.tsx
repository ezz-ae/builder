import Link from "next/link"
import { ALL_WEBSITE_TEMPLATES, WEBSITE_TEMPLATES_COUNT } from "@/components/templates/website-templates"

export default function TemplatesPage() {
  const docs = [
    { label: "Live Demos", href: "/showcase" },
    { label: "AI Chat Builder", href: "/ai-chat" },
    { label: "Start Building", href: "/builder" },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="px-6 py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">Templates</p>
          <h1 className="text-4xl md:text-5xl font-bold">29+ real estate templates ready to launch</h1>
          <p className="text-lg text-gray-600">
            Every template includes pages, blocks, and styling that are fully responsive, SEO-friendly, and bound to Neon data.
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

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500">Templates shipped with builder</p>
            <p className="text-3xl font-bold">{WEBSITE_TEMPLATES_COUNT} curated suites</p>
          </div>
          <p className="text-sm text-gray-600 max-w-xl">
            Browse templates filtered by use case, industry, or creative direction, then open the builder to customize every block.
          </p>
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
