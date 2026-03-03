"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import type { Website, Page, BlockInstance, BlockTemplate, PageTemplate } from "./types"
import { PageRenderer } from "./block-renderer"
import { ALL_WEBSITE_TEMPLATES } from "./templates/website-templates"
import { ALL_BLOCK_TEMPLATES } from "./templates/block-registry"
import {
  Plus, Trash2, ChevronUp, ChevronDown, GripVertical,
  FileText, Pencil, Monitor, Smartphone, X, Search,
  ArrowLeft, LayoutGrid, Zap, Check, Copy
} from "lucide-react"
import { InventoryPreview } from "./inventory-preview"

interface TemplateBuilderProps {
  onSave?: (website: Website) => void
}

// ============================================
// PAGE GROUPING — Split flat block lists into logical pages
// ============================================

const BLOCK_PAGE_MAP: Record<string, { page: string; title: string }> = {
  "header-sticky": { page: "home", title: "Home" },
  "hero-default": { page: "home", title: "Home" },
  "video-hero": { page: "home", title: "Home" },
  "listings-grid-3col": { page: "listings", title: "Listings" },
  "listings-grid-4col": { page: "listings", title: "Listings" },
  "listing-detail": { page: "listing-detail", title: "Property Detail" },
  "agent-grid": { page: "about", title: "About Us" },
  "agent-credentials": { page: "about", title: "About Us" },
  "testimonials": { page: "about", title: "About Us" },
  "contact-form": { page: "contact", title: "Contact" },
  "footer-default": { page: "home", title: "Home" },
  "gallery-grid-6": { page: "gallery", title: "Gallery" },
  "carousel-property": { page: "gallery", title: "Gallery" },
  "before-after": { page: "gallery", title: "Gallery" },
  "virtual-tour": { page: "gallery", title: "Gallery" },
  "property-features": { page: "listing-detail", title: "Property Detail" },
  "property-specs": { page: "listing-detail", title: "Property Detail" },
  "mortgage-calculator": { page: "tools", title: "Tools" },
  "price-breakdown": { page: "listing-detail", title: "Property Detail" },
  "similar-properties": { page: "listings", title: "Listings" },
  "investment-analysis": { page: "tools", title: "Tools" },
  "market-metrics-block": { page: "tools", title: "Tools" },
  "open-house": { page: "events", title: "Events" },
  "luxury-amenities": { page: "listing-detail", title: "Property Detail" },
  "neighborhood-info": { page: "listing-detail", title: "Property Detail" },
  "faq-accordion": { page: "about", title: "About Us" },
  "process-steps": { page: "about", title: "About Us" },
  "benefits-3col": { page: "about", title: "About Us" },
  "new-construction": { page: "listings", title: "Listings" },
  "services-grid": { page: "about", title: "About Us" },
  "map-section": { page: "contact", title: "Contact" },
  "cta-multi-button": { page: "home", title: "Home" },
}

function groupBlocksIntoPages(blockIds: string[]): Page[] {
  // Header and footer go on every page
  const headerBlock = blockIds.find((id) => id.includes("header"))
  const footerBlock = blockIds.find((id) => id.includes("footer"))
  const contentBlocks = blockIds.filter(
    (id) => !id.includes("header") && !id.includes("footer"),
  )

  const pageMap = new Map<string, { title: string; blockIds: string[] }>()

  for (const blockId of contentBlocks) {
    const mapping = BLOCK_PAGE_MAP[blockId] ?? { page: "home", title: "Home" }
    const existing = pageMap.get(mapping.page)
    if (existing) {
      existing.blockIds.push(blockId)
    } else {
      pageMap.set(mapping.page, { title: mapping.title, blockIds: [blockId] })
    }
  }

  // Ensure Home page exists and is first
  if (!pageMap.has("home")) {
    pageMap.set("home", { title: "Home", blockIds: [] })
  }

  // Build pages with header/footer on each
  const pages: Page[] = []
  const pageOrder = ["home", "listings", "listing-detail", "gallery", "about", "tools", "events", "contact"]

  for (const slug of pageOrder) {
    const entry = pageMap.get(slug)
    if (!entry) continue

    const allBlockIds: string[] = []
    if (headerBlock) allBlockIds.push(headerBlock)
    allBlockIds.push(...entry.blockIds)
    if (footerBlock) allBlockIds.push(footerBlock)

    const blocks: BlockInstance[] = allBlockIds
      .map((blockId, j) => {
        const bt = ALL_BLOCK_TEMPLATES.find((b) => b.id === blockId)
        if (!bt) return null
        return {
          id: `block-${slug}-${j}`,
          blockTemplateId: bt.id,
          props: { ...(bt.defaultProps ?? {}) },
        } as BlockInstance
      })
      .filter((b): b is BlockInstance => b !== null)

    if (blocks.length > 0) {
      pages.push({ id: `page-${slug}`, title: entry.title, slug, blocks })
    }
  }

  return pages
}

// ============================================
// BLOCK CATEGORIES for library
// ============================================

const BLOCK_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "hero", label: "Hero" },
  { id: "listings-grid", label: "Listings" },
  { id: "info", label: "Info" },
  { id: "gallery", label: "Gallery" },
  { id: "contact-form", label: "Forms" },
  { id: "cta", label: "CTA" },
  { id: "agent", label: "Agents" },
  { id: "header", label: "Header" },
  { id: "footer", label: "Footer" },
]

// Deduplicate blocks — only show primary IDs, not aliases
function getUniqueBlocks(): BlockTemplate[] {
  const seen = new Set<string>()
  return ALL_BLOCK_TEMPLATES.filter((b) => {
    if (seen.has(b.component ?? "")) return false
    seen.add(b.component ?? "")
    return true
  })
}

function applyBlockPropUpdates(
  block: BlockInstance,
  updates: Record<string, unknown>,
): BlockInstance {
  const nextProps = { ...(block.props ?? {}) }
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      delete nextProps[key]
    } else {
      nextProps[key] = value
    }
  }
  return { ...block, props: nextProps }
}

// ============================================
// MAIN TEMPLATE BUILDER
// ============================================

export function TemplateBuilder({ onSave }: TemplateBuilderProps) {
  const [step, setStep] = useState<"template-select" | "editor">("template-select")
  const [website, setWebsite] = useState<Website | null>(null)
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>("home")
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)
  const [blockCategoryFilter, setBlockCategoryFilter] = useState("all")
  const [blockSearch, setBlockSearch] = useState("")
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
  const [renamingPageSlug, setRenamingPageSlug] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [saved, setSaved] = useState(false)
  const [marketFetchStatus, setMarketFetchStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [marketFetchMessage, setMarketFetchMessage] = useState<string | null>(null)

  const uniqueBlocks = useMemo(() => getUniqueBlocks(), [])

  const filteredBlocks = useMemo(() => {
    let blocks = uniqueBlocks
    if (blockCategoryFilter !== "all") {
      blocks = blocks.filter((b) => b.category === blockCategoryFilter)
    }
    if (blockSearch) {
      const q = blockSearch.toLowerCase()
      blocks = blocks.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q)),
      )
    }
    return blocks
  }, [uniqueBlocks, blockCategoryFilter, blockSearch])

  const currentPage = website?.pages.find((p) => p.slug === selectedPageSlug)
  const editingBlock = currentPage?.blocks.find((b) => b.id === editingBlockId)
  const editingBlockTemplate = editingBlock
    ? ALL_BLOCK_TEMPLATES.find((t) => t.id === editingBlock.blockTemplateId)
    : null
  const isMarketMetricsBlock = editingBlockTemplate?.id === "market-metrics-block"
  const marketAddressValue =
    typeof editingBlock?.props?.address === "string" ? editingBlock.props.address : ""
  const marketPriceValue =
    typeof editingBlock?.props?.price === "number" ? editingBlock.props.price : ""

  useEffect(() => {
    setMarketFetchStatus("idle")
    setMarketFetchMessage(null)
  }, [editingBlockId])

  // Load template
  const handleSelectTemplate = useCallback((templateId: string) => {
    const template = ALL_WEBSITE_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    const templatePages = template.pages as (PageTemplate | string)[]
    const pageObjects = templatePages.filter(
      (p: PageTemplate | string): p is PageTemplate => typeof p === "object",
    )
    const blockIds = templatePages.filter(
      (p: PageTemplate | string): p is string => typeof p === "string",
    )

    let pages: Page[]

    if (pageObjects.length > 0) {
      pages = pageObjects.map((pt: PageTemplate, i: number) => ({
        id: `page-${i}`,
        title: pt.name,
        slug: pt.slug ?? pt.category,
        blocks: pt.blocks.map(
          (bt: import("./types").BlockTemplate, j: number) => ({
            id: `block-${i}-${j}`,
            blockTemplateId: bt.id,
            props: { ...(bt.defaultProps ?? {}) },
          }),
        ),
      }))
    } else {
      pages = groupBlocksIntoPages(blockIds)
    }

    // Handle templates that use `settings` instead of `defaultSettings`
    const tAny = template as Record<string, unknown>
    const altSettings = (tAny.settings || {}) as Record<string, string>
    const resolvedSettings = template.defaultSettings?.colors
      ? template.defaultSettings
      : {
          colors: {
            primary: altSettings.primaryColor || "#2563eb",
            secondary: altSettings.secondaryColor || "#1e40af",
            accent: altSettings.accentColor || "#10b981",
            text: "#1a1a1a",
            background: "#ffffff",
          },
          fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
          branding: {
            logoUrl: altSettings.logoUrl || "",
            companyName: altSettings.logoText || template.name,
            phone: "",
            email: "",
            address: "",
          },
        }

    const site: Website = {
      id: `website-${Date.now()}`,
      name: template.name,
      pages,
      settings: resolvedSettings,
      template: templateId,
      category: template.category,
      description: template.description,
    }

    setWebsite(site)
    setStep("editor")
    setSelectedPageSlug(pages[0]?.slug ?? "home")
    setEditingBlockId(null)
    setSaved(false)
  }, [])

  // Update website helper
  const updatePages = useCallback(
    (updater: (pages: Page[]) => Page[]) => {
      if (!website) return
      setWebsite({ ...website, pages: updater(website.pages) })
      setSaved(false)
    },
    [website],
  )

  // Add block to current page
  const handleAddBlock = useCallback(
    (blockTemplateId: string) => {
      const bt = ALL_BLOCK_TEMPLATES.find((t) => t.id === blockTemplateId)
      if (!bt) return
      const newBlock: BlockInstance = {
        id: `block-${Date.now()}`,
        blockTemplateId,
        props: { ...(bt.defaultProps ?? {}) },
      }
      updatePages((pages) =>
        pages.map((p) =>
          p.slug === selectedPageSlug
            ? { ...p, blocks: [...p.blocks, newBlock] }
            : p,
        ),
      )
      setShowBlockLibrary(false)
    },
    [selectedPageSlug, updatePages],
  )

  // Remove block
  const handleRemoveBlock = useCallback(
    (blockId: string) => {
      updatePages((pages) =>
        pages.map((p) =>
          p.slug === selectedPageSlug
            ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
            : p,
        ),
      )
      if (editingBlockId === blockId) setEditingBlockId(null)
    },
    [selectedPageSlug, editingBlockId, updatePages],
  )

  // Move block up/down
  const handleMoveBlock = useCallback(
    (blockId: string, direction: "up" | "down") => {
      updatePages((pages) =>
        pages.map((p) => {
          if (p.slug !== selectedPageSlug) return p
          const idx = p.blocks.findIndex((b) => b.id === blockId)
          if (idx < 0) return p
          const newIdx = direction === "up" ? idx - 1 : idx + 1
          if (newIdx < 0 || newIdx >= p.blocks.length) return p
          const blocks = [...p.blocks]
          ;[blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]]
          return { ...p, blocks }
        }),
      )
    },
    [selectedPageSlug, updatePages],
  )

  // Duplicate block
  const handleDuplicateBlock = useCallback(
    (blockId: string) => {
      updatePages((pages) =>
        pages.map((p) => {
          if (p.slug !== selectedPageSlug) return p
          const idx = p.blocks.findIndex((b) => b.id === blockId)
          if (idx < 0) return p
          const clone = {
            ...p.blocks[idx],
            id: `block-${Date.now()}`,
            props: { ...p.blocks[idx].props },
          }
          const blocks = [...p.blocks]
          blocks.splice(idx + 1, 0, clone)
          return { ...p, blocks }
        }),
      )
    },
    [selectedPageSlug, updatePages],
  )

  // Update block props
  const handleUpdateBlockProps = useCallback(
    (blockId: string, updates: Record<string, unknown>) => {
      updatePages((pages) =>
        pages.map((p) =>
          p.slug === selectedPageSlug
            ? {
                ...p,
                blocks: p.blocks.map((b) =>
                  b.id === blockId ? applyBlockPropUpdates(b, updates) : b,
                ),
              }
            : p,
        ),
      )
    },
    [selectedPageSlug, updatePages],
  )

  const handleUpdateBlockProp = useCallback(
    (blockId: string, key: string, value: unknown) => {
      handleUpdateBlockProps(blockId, { [key]: value })
    },
    [handleUpdateBlockProps],
  )

  // Page management
  const handleAddPage = useCallback(() => {
    const slug = `page-${Date.now()}`
    const newPage: Page = {
      id: slug,
      title: "New Page",
      slug,
      blocks: [],
    }
    updatePages((pages) => [...pages, newPage])
    setSelectedPageSlug(slug)
  }, [updatePages])

  const handleDeletePage = useCallback(
    (slug: string) => {
      if (!website || website.pages.length <= 1) return
      updatePages((pages) => pages.filter((p) => p.slug !== slug))
      if (selectedPageSlug === slug) {
        const remaining = website.pages.filter((p) => p.slug !== slug)
        setSelectedPageSlug(remaining[0]?.slug ?? "home")
      }
    },
    [website, selectedPageSlug, updatePages],
  )

  const handleRenamePage = useCallback(
    (slug: string, newTitle: string) => {
      if (!newTitle.trim()) return
      updatePages((pages) =>
        pages.map((p) => (p.slug === slug ? { ...p, title: newTitle.trim() } : p)),
      )
      setRenamingPageSlug(null)
    },
    [updatePages],
  )

  // Save & Publish
  const handleSave = useCallback(() => {
    if (!website) return
    // Save to localStorage
    localStorage.setItem("builder-published-site", JSON.stringify(website))
    if (onSave) onSave(website)
    setSaved(true)
    // Open preview in new tab
    window.open("/preview", "_blank")
    setTimeout(() => setSaved(false), 3000)
  }, [website, onSave])

  const handleFetchMarketData = useCallback(async () => {
    if (!editingBlockId) return

    const trimmedAddress = marketAddressValue.trim()
    if (!trimmedAddress) {
      setMarketFetchStatus("error")
      setMarketFetchMessage("Enter an address to fetch market data.")
      return
    }

    setMarketFetchStatus("loading")
    setMarketFetchMessage(null)

    try {
      const params = new URLSearchParams({ address: trimmedAddress })
      if (typeof marketPriceValue === "number" && Number.isFinite(marketPriceValue)) {
        params.set("price", String(marketPriceValue))
      }
      const response = await fetch(`/api/market-analysis?${params.toString()}`)
      const payload = await response.json()

      if (payload?.success && Array.isArray(payload?.data?.marketMetrics)) {
        handleUpdateBlockProps(editingBlockId, {
          metrics: payload.data.marketMetrics,
          address: trimmedAddress,
          price: typeof marketPriceValue === "number" && Number.isFinite(marketPriceValue)
            ? marketPriceValue
            : undefined,
        })
        setMarketFetchStatus("success")
        setMarketFetchMessage("Market data updated.")
      } else {
        setMarketFetchStatus("error")
        setMarketFetchMessage(payload?.error ?? "Market data unavailable.")
      }
    } catch (error) {
      setMarketFetchStatus("error")
      setMarketFetchMessage("Market analysis request failed.")
    }
  }, [editingBlockId, handleUpdateBlockProps, marketAddressValue, marketPriceValue])

  // ── Template Selector ──
  if (step === "template-select") {
    return <TemplateSelector onSelect={handleSelectTemplate} />
  }

  if (!website) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>

  // ── Editor ──
  return (
    <div className="h-screen flex bg-gray-950 text-white overflow-hidden">
      {/* ────── LEFT SIDEBAR ────── */}
      <div className="w-72 border-r border-gray-800 flex flex-col bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold tracking-tight">Website Builder</h1>
          </div>
          <button
            onClick={() => setStep("template-select")}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft className="w-3 h-3" /> Change Template
          </button>
        </div>

        {/* Pages */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</h2>
              <button
                onClick={handleAddPage}
                className="p-1 hover:bg-gray-800 rounded transition"
                title="Add page"
              >
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-1">
              {website.pages.map((page, idx) => (
                <div
                  key={page.slug}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                    selectedPageSlug === page.slug
                      ? "bg-blue-600/20 border border-blue-500/40 text-blue-200"
                      : "hover:bg-gray-800/60 text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedPageSlug(page.slug)
                    setEditingBlockId(null)
                  }}
                >
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {renamingPageSlug === page.slug ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRenamePage(page.slug, renameValue)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenamePage(page.slug, renameValue)
                          if (e.key === "Escape") setRenamingPageSlug(null)
                        }}
                        className="w-full bg-gray-800 text-white text-xs px-2 py-0.5 rounded border border-gray-600 outline-none focus:border-blue-500"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <p className="text-xs font-medium truncate">{page.title}</p>
                        <p className="text-[10px] text-gray-500">
                          {page.blocks.length} block{page.blocks.length !== 1 ? "s" : ""}
                        </p>
                      </>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setRenamingPageSlug(page.slug)
                        setRenameValue(page.title)
                      }}
                      className="p-0.5 hover:bg-gray-700 rounded"
                      title="Rename"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {website.pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePage(page.slug)
                        }}
                        className="p-0.5 hover:bg-red-900/50 rounded text-red-400"
                        title="Delete page"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block Library */}
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => setShowBlockLibrary(!showBlockLibrary)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-xs"
            >
              {showBlockLibrary ? (
                <>
                  <X className="w-3.5 h-3.5" /> Close Library
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add Block
                </>
              )}
            </button>

            {showBlockLibrary && (
              <div className="mt-3 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search blocks..."
                    value={blockSearch}
                    onChange={(e) => setBlockSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-800 text-xs rounded-lg border border-gray-700 outline-none focus:border-blue-500 text-white placeholder-gray-500"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {BLOCK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setBlockCategoryFilter(cat.id)}
                      className={`px-2 py-0.5 text-[10px] rounded-full transition ${
                        blockCategoryFilter === cat.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Block List */}
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {filteredBlocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => handleAddBlock(block.id)}
                      className="w-full text-left px-3 py-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg text-xs transition border border-transparent hover:border-gray-600"
                    >
                      <span className="font-medium text-white block">{block.name}</span>
                      <span className="text-[10px] text-gray-500">{block.description}</span>
                    </button>
                  ))}
                  {filteredBlocks.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4">No blocks found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold transition text-sm ${
              saved
                ? "bg-green-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Saved!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Save & Publish
              </>
            )}
          </button>
        </div>
      </div>

      {/* ────── CENTER CANVAS ────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-11 bg-gray-900 border-b border-gray-800 flex items-center px-5 gap-4">
          <h2 className="text-sm font-semibold text-gray-200 truncate">
            {currentPage?.title ?? "Select a page"}
          </h2>
          <span className="text-[10px] text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
            /{currentPage?.slug}
          </span>
          <div className="ml-auto flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded transition ${viewMode === "desktop" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded transition ${viewMode === "mobile" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
              title="Mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-950 p-6">
          <div
            className={`mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
              viewMode === "mobile" ? "max-w-sm" : "max-w-5xl"
            }`}
          >
            {currentPage && currentPage.blocks.length > 0 ? (
              <PageRenderer
                website={website}
                pageSlug={selectedPageSlug}
                editMode={true}
                onSelectBlock={setEditingBlockId}
              />
            ) : (
              <div className="py-32 text-center text-gray-400">
                <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-600 mb-2">No blocks yet</p>
                <p className="text-sm text-gray-400 mb-6">Add blocks from the sidebar to build this page</p>
                <button
                  onClick={() => setShowBlockLibrary(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition text-sm"
                >
                  <Plus className="w-4 h-4" /> Add First Block
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ────── RIGHT SIDEBAR — Block Editor ────── */}
      {editingBlockId && editingBlock && editingBlockTemplate && (
        <div className="w-80 border-l border-gray-800 flex flex-col bg-gray-900 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">{editingBlockTemplate.name}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">{editingBlockTemplate.description}</p>
            </div>
            <button
              onClick={() => setEditingBlockId(null)}
              className="p-1 hover:bg-gray-800 rounded transition text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleMoveBlock(editingBlockId, "up")}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs transition"
                title="Move up"
              >
                <ChevronUp className="w-3.5 h-3.5" /> Up
              </button>
              <button
                onClick={() => handleMoveBlock(editingBlockId, "down")}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs transition"
                title="Move down"
              >
                <ChevronDown className="w-3.5 h-3.5" /> Down
              </button>
              <button
                onClick={() => handleDuplicateBlock(editingBlockId)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs transition"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" /> Clone
              </button>
            </div>

            {/* Editable Props */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Properties</h4>
              <div className="space-y-3">
                {renderBlockProps(editingBlock, editingBlockTemplate, handleUpdateBlockProp)}
              </div>
            </div>

            {isMarketMetricsBlock && (
              <div className="border border-gray-800 rounded-lg p-3 bg-gray-900/60 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Analysis</h4>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={marketAddressValue}
                    onChange={(e) => {
                      const nextValue = e.target.value
                      handleUpdateBlockProp(
                        editingBlockId,
                        "address",
                        nextValue.trim().length > 0 ? nextValue : undefined,
                      )
                      setMarketFetchStatus("idle")
                      setMarketFetchMessage(null)
                    }}
                    placeholder="Enter address or district"
                    className="w-full bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={marketPriceValue}
                    onChange={(e) => {
                      const nextValue = e.target.value
                      const parsed = nextValue === "" ? undefined : Number(nextValue)
                      handleUpdateBlockProp(
                        editingBlockId,
                        "price",
                        Number.isFinite(parsed as number) ? parsed : undefined,
                      )
                      setMarketFetchStatus("idle")
                      setMarketFetchMessage(null)
                    }}
                    placeholder="Target price"
                    className="w-full bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleFetchMarketData}
                  disabled={marketFetchStatus === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition text-xs"
                >
                  {marketFetchStatus === "loading" ? "Fetching..." : "Fetch Market Data"}
                </button>
                {marketFetchMessage && (
                  <p className={`text-[10px] ${marketFetchStatus === "error" ? "text-red-400" : "text-emerald-400"}`}>
                    {marketFetchMessage}
                  </p>
                )}
              </div>
            )}

            {/* Delete */}
            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  handleRemoveBlock(editingBlockId)
                  setEditingBlockId(null)
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-lg font-medium transition text-xs border border-red-900/40"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// BLOCK PROPERTY EDITOR
// ============================================

function renderBlockProps(
  block: BlockInstance,
  template: BlockTemplate,
  onUpdate: (blockId: string, key: string, value: unknown) => void,
) {
  const props = block.props ?? {}
  const editableTextKeys = template.customizable?.text ?? []
  const editableColorKeys = template.customizable?.colors ?? []
  const editableSettingsKeys = template.customizable?.settings ?? []
  const allEditableKeys = [...editableTextKeys, ...editableColorKeys, ...editableSettingsKeys]

  // If template defines customizable fields, show those
  if (allEditableKeys.length > 0) {
    return allEditableKeys.map((key) => {
      const value = props[key]
      if (editableColorKeys.includes(key)) {
        return (
          <div key={key}>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">{key}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={typeof value === "string" ? value : "#2563eb"}
                onChange={(e) => onUpdate(block.id, key, e.target.value)}
                className="w-8 h-8 rounded border border-gray-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onUpdate(block.id, key, e.target.value)}
                className="flex-1 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )
      }
      if (typeof value === "boolean") {
        return (
          <div key={key} className="flex items-center justify-between">
            <label className="text-xs text-gray-300">{formatLabel(key)}</label>
            <button
              onClick={() => onUpdate(block.id, key, !value)}
              className={`w-9 h-5 rounded-full transition ${value ? "bg-blue-600" : "bg-gray-700"}`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform mx-0.5 ${value ? "translate-x-4" : ""}`} />
            </button>
          </div>
        )
      }
      if (typeof value === "number") {
        return (
          <div key={key}>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">{formatLabel(key)}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => onUpdate(block.id, key, Number(e.target.value))}
              className="w-full bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
            />
          </div>
        )
      }
      // Default: text input
      return (
        <div key={key}>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">{formatLabel(key)}</label>
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onUpdate(block.id, key, e.target.value)}
            className="w-full bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
          />
        </div>
      )
    })
  }

  // Fallback: show common editable props from the block's actual data
  const commonProps = ["title", "subtitle", "description"]
  const found = commonProps.filter((k) => typeof props[k] === "string")

  if (found.length === 0) {
    return (
      <p className="text-xs text-gray-500 italic">
        This block has no editable properties.
      </p>
    )
  }

  return found.map((key) => (
    <div key={key}>
      <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">{formatLabel(key)}</label>
      {(props[key] as string).length > 60 ? (
        <textarea
          value={props[key] as string}
          onChange={(e) => onUpdate(block.id, key, e.target.value)}
          rows={3}
          className="w-full bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500 resize-none"
        />
      ) : (
        <input
          type="text"
          value={props[key] as string}
          onChange={(e) => onUpdate(block.id, key, e.target.value)}
          className="w-full bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
        />
      )}
    </div>
  ))
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

// ============================================
// TEMPLATE SELECTOR (with proper previews)
// ============================================

const CATEGORY_CONFIG: Record<string, { color: string; gradient: string; icon: string }> = {
  luxury: { color: "#d4af37", gradient: "from-amber-900 to-yellow-800", icon: "Crown" },
  mainstream: { color: "#3b82f6", gradient: "from-blue-900 to-blue-700", icon: "Building" },
  specialized: { color: "#8b5cf6", gradient: "from-purple-900 to-violet-700", icon: "Sparkles" },
  industry: { color: "#10b981", gradient: "from-emerald-900 to-green-700", icon: "Factory" },
}

function TemplateSelector({ onSelect }: { onSelect: (templateId: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categories = ["luxury", "mainstream", "specialized", "industry"]

  const templates = useMemo(() => {
    let result = ALL_WEBSITE_TEMPLATES
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags?.some((tag: string) => tag.toLowerCase().includes(q)),
      )
    }
    return result
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Choose a Template</h1>
          <p className="text-gray-400 text-sm">
            {ALL_WEBSITE_TEMPLATES.length} professional real estate templates
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Category Pills */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                selectedCategory === null
                  ? "bg-white text-gray-900"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              All ({ALL_WEBSITE_TEMPLATES.length})
            </button>
            {categories.map((cat) => {
              const count = ALL_WEBSITE_TEMPLATES.filter((t) => t.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition capitalize ${
                    selectedCategory === cat
                      ? "bg-white text-gray-900"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              )
            })}

            {/* Search */}
            <div className="ml-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-gray-800 text-xs rounded-full border border-gray-700 outline-none focus:border-blue-500 text-white placeholder-gray-500 w-52"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <InventoryPreview limit={4} />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((template) => {
            const catConfig = CATEGORY_CONFIG[template.category ?? "mainstream"] ?? CATEGORY_CONFIG.mainstream
            const pageCount = template.pages.length
            const hasPageObjects = template.pages.some((p: unknown) => typeof p === "object")
            // Handle both defaultSettings.colors.X and settings.primaryColor shapes
            const tAny = template as Record<string, unknown>
            const ds = template.defaultSettings || {}
            const altSettings = (tAny.settings || {}) as Record<string, unknown>
            const primaryColor = ds.colors?.primary || (altSettings.primaryColor as string) || catConfig.color
            const accentColor = ds.colors?.accent || (altSettings.accentColor as string) || primaryColor
            const bgColor = ds.colors?.background || "#ffffff"

            return (
              <div
                key={template.id}
                className="group bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer border border-gray-800 hover:border-gray-600"
                onClick={() => onSelect(template.id)}
              >
                {/* Preview — uses actual template colors */}
                <div
                  className="h-44 relative overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Mini header bar */}
                  <div
                    className="h-6 flex items-center px-3 gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="w-12 h-2 rounded bg-white/40" />
                    <div className="ml-auto flex gap-2">
                      <div className="w-6 h-1.5 rounded bg-white/30" />
                      <div className="w-6 h-1.5 rounded bg-white/30" />
                      <div className="w-6 h-1.5 rounded bg-white/30" />
                    </div>
                  </div>
                  {/* Mini hero section */}
                  <div
                    className="mx-2 mt-2 rounded h-16 flex flex-col items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <div
                      className="h-2.5 rounded w-24 mb-1"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className="h-1.5 rounded w-16 bg-gray-300" />
                    <div
                      className="h-3 rounded w-12 mt-2"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                  {/* Mini grid */}
                  <div className="mx-2 mt-2 flex gap-1.5">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex-1 rounded overflow-hidden border border-gray-200">
                        <div className="h-6 bg-gray-200" />
                        <div className="h-3 px-1 py-0.5">
                          <div className="h-1 rounded bg-gray-300 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-8 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 text-white/80 backdrop-blur-sm">
                      {template.category}
                    </span>
                  </div>
                  {/* Block/page count */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/70 backdrop-blur-sm">
                      {hasPageObjects ? `${pageCount} pages` : `${pageCount} blocks`}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-1 group-hover:text-blue-400 transition truncate">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-gray-800 group-hover:bg-blue-600 text-gray-300 group-hover:text-white px-4 py-2 rounded-lg font-medium transition text-xs">
                    Use Template
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No templates match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
