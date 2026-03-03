"use client"

import { FormEvent, useState } from "react"

type ChatForm = {
  propertyAddress: string
  price: string
  beds: string
  baths: string
  sqft: string
  description: string
  agencyName: string
  targetAudience: string
}

type CampaignResponse = {
  adHeadline: string
  adCopy: string
  ctaText: string
  keywordSuggestions: string[]
  audienceSuggestions: string[]
  platforms: string[]
  estimatedReach: string
  emailSequence: Array<{ day: number; subject: string; body: string }>
  socialMediaCaptions: Array<{ platform: string; caption: string }>
}

type SeoResponse = {
  seoTitle: string
  metaDescription: string
  longDescription: string
  keywords: string[]
}

type AiChatResponse = {
  campaign: CampaignResponse
  seoCopy: SeoResponse
}

const defaultForm: ChatForm = {
  propertyAddress: "123 Market Street, San Francisco, CA 94105",
  price: "2500000",
  beds: "4",
  baths: "3",
  sqft: "3500",
  description: "Stunning Victorian home with updated interiors and designer finishes.",
  agencyName: "Premier Real Estate",
  targetAudience: "Luxury buyers in San Francisco",
}

export default function AIChatPage() {
  const [form, setForm] = useState<ChatForm>(defaultForm)
  const [response, setResponse] = useState<AiChatResponse | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (field: keyof ChatForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage(null)
    setResponse(null)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyName: form.agencyName,
          propertyAddress: form.propertyAddress,
          price: Number(form.price),
          beds: Number(form.beds),
          baths: Number(form.baths),
          sqft: Number(form.sqft),
          description: form.description,
          targetAudience: form.targetAudience,
        }),
      })

      const payload = await res.json()

      if (!payload.success) {
        setErrorMessage(payload.error ?? "Failed to generate AI content")
        setStatus("error")
        return
      }

      setResponse(payload.data as AiChatResponse)
      setStatus("success")
    } catch (error) {
      setErrorMessage((error as Error).message ?? "Unexpected error")
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">AI chat builder</p>
          <h1 className="text-4xl font-bold">Spin up marketing campaigns in seconds</h1>
          <p className="text-lg text-slate-300">
            Feed property details, let Vertex Gemini craft ad copy, keywords, email follow-ups, and SEO-ready descriptions — all from one chat flow.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Property address", field: "propertyAddress" },
              { label: "Price (USD)", field: "price" },
              { label: "Bedrooms", field: "beds" },
            ].map(({ label, field }) => (
              <label key={field} className="text-sm text-slate-300 space-y-2">
                <span className="font-semibold text-white">{label}</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  value={form[field as keyof ChatForm]}
                  onChange={(event) => handleChange(field as keyof ChatForm, event.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Bathrooms", field: "baths" },
              { label: "Square feet", field: "sqft" },
              { label: "Target audience (optional)", field: "targetAudience" },
            ].map(({ label, field }) => (
              <label key={field} className="text-sm text-slate-300 space-y-2">
                <span className="font-semibold text-white">{label}</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  value={form[field as keyof ChatForm]}
                  onChange={(event) => handleChange(field as keyof ChatForm, event.target.value)}
                />
              </label>
            ))}
          </div>
          <label className="text-sm text-slate-300 space-y-2">
            <span className="font-semibold text-white">Property description</span>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
            />
          </label>
          <label className="text-sm text-slate-300 space-y-2">
            <span className="font-semibold text-white">Agency name</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
              value={form.agencyName}
              onChange={(event) => handleChange("agencyName", event.target.value)}
            />
          </label>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-cyan-500 font-semibold text-sm uppercase tracking-[0.3em] text-slate-950 hover:bg-cyan-400 transition"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Generating…" : "Generate Campaign"}
            </button>
            {status === "success" && <span className="text-xs text-emerald-300">AI response ready</span>}
            {status === "error" && <span className="text-xs text-rose-300">Something went wrong</span>}
          </div>
          {errorMessage && <p className="text-sm text-rose-200">{errorMessage}</p>}
        </form>

        {response && (
          <section className="space-y-6">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">Campaign Summary</h2>
              <p className="mt-3 text-slate-200 text-sm">{response.campaign.adHeadline}</p>
              <p className="text-slate-300 text-sm">{response.campaign.adCopy}</p>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">CTA</p>
                <p className="font-semibold text-lg">{response.campaign.ctaText}</p>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Platforms</p>
                  <p className="text-slate-200">{response.campaign.platforms.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reach</p>
                  <p className="text-slate-200">{response.campaign.estimatedReach}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Keywords</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {response.campaign.keywordSuggestions.map((keyword) => (
                    <span key={keyword} className="px-3 py-1 text-xs rounded-full bg-white/10">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Audiences</p>
                  <ul className="mt-2 list-disc list-inside text-sm text-slate-200">
                    {response.campaign.audienceSuggestions.map((audience) => (
                      <li key={audience}>{audience}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email follow-up</p>
                  <ul className="mt-2 text-sm text-slate-200 space-y-1">
                    {response.campaign.emailSequence.map((email) => (
                      <li key={email.day}>
                        Day {email.day}: <span className="font-semibold">{email.subject}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-white">SEO Description</h3>
              <p className="text-sm text-slate-300">{response.seoCopy.metaDescription}</p>
              <div className="text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Title</p>
                <p className="font-semibold text-lg">{response.seoCopy.seoTitle}</p>
              </div>
              <p className="text-sm text-slate-200">{response.seoCopy.longDescription}</p>
              <div className="flex flex-wrap gap-2 text-xs text-cyan-200">
                {response.seoCopy.keywords.map((keyword) => (
                  <span key={keyword} className="px-3 py-1 bg-cyan-500/20 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </article>
          </section>
        )}
      </div>
    </div>
  )
}
