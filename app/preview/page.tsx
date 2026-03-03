"use client"

import { useEffect, useState } from "react"
import type { Website } from "@/components/types"
import { WebsiteRenderer } from "@/components/block-renderer"

export default function PreviewPage() {
  const [website, setWebsite] = useState<Website | null>(null)
  const [currentPage, setCurrentPage] = useState("home")
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("builder-published-site")
      if (saved) {
        setWebsite(JSON.parse(saved))
      } else {
        setError("No published website found. Go to the builder and click 'Save & Publish' first.")
      }
    } catch {
      setError("Failed to load website data.")
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Website Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/builder"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Builder
          </a>
        </div>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Preview navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Preview Mode</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{website.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {website.pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => setCurrentPage(page.slug)}
              className={`px-3 py-1 rounded text-xs transition ${
                currentPage === page.slug
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {page.title}
            </button>
          ))}
          <span className="text-gray-400">|</span>
          <a
            href="/builder"
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 transition"
          >
            Back to Builder
          </a>
        </div>
      </div>

      {/* Website content with top padding for nav bar */}
      <div className="pt-10">
        <WebsiteRenderer
          website={website}
          currentPage={currentPage}
        />
      </div>
    </div>
  )
}
