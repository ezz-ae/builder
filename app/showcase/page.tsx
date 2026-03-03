import Link from "next/link"
import { PAGE_TEMPLATES, STARTER_WEBSITE } from "@/components/templates/real-estate-pages"

export default function ShowcasePage() {
  const heroTemplate = STARTER_WEBSITE.pages.find((page) => page.slug === "home")

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-6 py-12 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Full Site Demos</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">See full websites assembled from live templates</h1>
          <p className="text-lg text-slate-200">
            Each site demo wires up headers, hero sections, property grids, testimonials, and contact pages so you can preview the builder output.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/builder" className="px-5 py-3 rounded-full border border-cyan-500 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/10 transition">
              Open Builder
            </Link>
            <Link href="/templates" className="px-5 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-100 hover:bg-white/10 transition">
              Browse Templates
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
              <p className="text-slate-200">{heroTemplate.blocks.length} blocks · {heroTemplate.seo.metaDescription}</p>
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
            <h3 className="text-2xl font-bold">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-300">Pages Available</p>
                <p className="text-3xl font-semibold">{PAGE_TEMPLATES.length}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-300">Templates</p>
                <p className="text-3xl font-semibold">29+</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-300">Blocks</p>
                <p className="text-3xl font-semibold">38</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-300">Live AI</p>
                <p className="text-3xl font-semibold">Gemini 1.5</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Page templates in action</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {PAGE_TEMPLATES.map((page) => (
              <article key={page.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{page.name}</h3>
                    <p className="text-sm text-slate-300">{page.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-200">{page.category}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                  {page.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full border border-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
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
