"use client"

import React, { useState } from "react"
import type { Website, Page, BlockInstance, PageTemplate } from "./types"
import { PageRenderer } from "./block-renderer"
import { ALL_WEBSITE_TEMPLATES } from "./templates/website-templates"
import { ALL_BLOCK_TEMPLATES } from "./templates/block-registry"

interface TemplateBuilderProps {
  onSave?: (website: Website) => void
}

/**
 * Main Template Builder Component
 * Allows users to select templates, customize pages, add/edit blocks
 */
export function TemplateBuilder({ onSave }: TemplateBuilderProps) {
  const [step, setStep] = useState<"template-select" | "editor">("template-select")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [website, setWebsite] = useState<Website | null>(null)
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>("home")
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)

  // Load template — convert WebsiteTemplate (string block IDs) → proper Website with Page objects
  const handleSelectTemplate = (templateId: string) => {
    const template = ALL_WEBSITE_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    // Separate actual PageTemplate objects from raw string block IDs
    const templatePages = template.pages as (PageTemplate | string)[]
    const pageObjects = templatePages.filter((p: PageTemplate | string): p is PageTemplate => typeof p === "object")
    const blockIds = templatePages.filter((p: PageTemplate | string): p is string => typeof p === "string")

    let pages: Page[]

    if (pageObjects.length > 0) {
      // Templates that use real PageTemplate objects
      pages = pageObjects.map((pt: PageTemplate, i: number) => ({
        id: `page-${i}`,
        title: pt.name,
        slug: pt.slug ?? pt.category,
        blocks: pt.blocks.map((bt: import("./types").BlockTemplate, j: number) => ({
          id: `block-${i}-${j}`,
          blockTemplateId: bt.id,
          props: { ...(bt.defaultProps ?? {}) },
        })),
      }))
    } else {
      // Templates that store a flat list of block IDs → single "Home" page
      const blocks: BlockInstance[] = blockIds
        .map((blockId: string, j: number) => {
          const bt = ALL_BLOCK_TEMPLATES.find((b) => b.id === blockId)
          if (!bt) return null
          return {
            id: `block-0-${j}`,
            blockTemplateId: bt.id,
            props: { ...(bt.defaultProps ?? {}) },
          } as BlockInstance
        })
        .filter((b): b is BlockInstance => b !== null)

      pages = [{ id: "page-home", title: "Home", slug: "home", blocks }]
    }

    const website: Website = {
      id: `website-${Date.now()}`,
      name: template.name,
      pages,
      settings: template.defaultSettings,
      template: templateId,
      category: template.category,
      description: template.description,
    }

    setSelectedTemplate(templateId)
    setWebsite(website)
    setStep("editor")
    setSelectedPageSlug(pages[0].slug)
  }

  // Add block to page
  const handleAddBlock = (blockTemplateId: string) => {
    if (!website) return

    const page = website.pages.find((p) => p.slug === selectedPageSlug)
    if (!page) return

    const blockTemplate = ALL_BLOCK_TEMPLATES.find((t) => t.id === blockTemplateId)
    if (!blockTemplate) return

    const newBlock: BlockInstance = {
      id: `block-${Date.now()}`,
      blockTemplateId,
      props: { ...blockTemplate.defaultProps },
    }

    const updatedPages = website.pages.map((p) =>
      p.slug === selectedPageSlug ? { ...p, blocks: [...(p.blocks || []), newBlock] } : p,
    )

    setWebsite({ ...website, pages: updatedPages })
    setShowBlockLibrary(false)
  }

  // Remove block from page
  const handleRemoveBlock = (blockId: string) => {
    if (!website) return

    const updatedPages = website.pages.map((p) =>
      p.slug === selectedPageSlug
        ? { ...p, blocks: (p.blocks || []).filter((b) => b.id !== blockId) }
        : p,
    )

    setWebsite({ ...website, pages: updatedPages })
  }

  // Reorder blocks
  const handleReorderBlocks = (fromIndex: number, toIndex: number) => {
    if (!website) return

    const page = website.pages.find((p) => p.slug === selectedPageSlug)
    if (!page || !page.blocks) return

    const blocks = [...page.blocks]
    const [removed] = blocks.splice(fromIndex, 1)
    blocks.splice(toIndex, 0, removed)

    const updatedPages = website.pages.map((p) =>
      p.slug === selectedPageSlug ? { ...p, blocks } : p,
    )

    setWebsite({ ...website, pages: updatedPages })
  }

  // Save website
  const handleSave = () => {
    if (website && onSave) {
      onSave(website)
    }
  }

  if (step === "template-select") {
    return <TemplateSelector onSelect={handleSelectTemplate} />
  }

  if (!website) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Left Sidebar - Pages & Blocks */}
      <div className="w-64 border-r border-gray-700 flex flex-col bg-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold mb-4">Website Builder</h1>
          <button
            onClick={() => setStep("template-select")}
            className="text-sm text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Change Template
          </button>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase">Pages</h2>
            <div className="space-y-2">
              {website.pages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => {
                    setSelectedPageSlug(page.slug)
                    setEditingBlockId(null)
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    selectedPageSlug === page.slug
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <span className="text-sm font-medium">{page.title}</span>
                  <span className="text-xs text-gray-400 block">
                    {(page.blocks || []).length} blocks
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Block Library */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowBlockLibrary(!showBlockLibrary)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition text-sm"
            >
              {showBlockLibrary ? "Hide" : "Add Block"}
            </button>

            {showBlockLibrary && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {ALL_BLOCK_TEMPLATES.slice(0, 15).map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleAddBlock(block.id)}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                    title={block.description}
                  >
                    <span className="font-medium text-white">{block.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition"
          >
            Save & Publish
          </button>
        </div>
      </div>

      {/* Center - Canvas Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-6 gap-4">
          <h2 className="font-bold text-white">
            {website.pages.find((p) => p.slug === selectedPageSlug)?.title}
          </h2>
          <div className="ml-auto flex gap-2">
            <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition">
              Desktop
            </button>
            <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition">
              Mobile
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
            <PageRenderer
              website={website}
              pageSlug={selectedPageSlug}
              editMode={true}
              onSelectBlock={setEditingBlockId}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Block Editor */}
      {editingBlockId && (
        <div className="w-80 border-l border-gray-700 flex flex-col bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-bold">Block Settings</h3>
            <button
              onClick={() => setEditingBlockId(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-400">Block ID</p>
              <p className="text-sm font-mono text-white break-all">{editingBlockId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Block Properties
              </label>
              <p className="text-xs text-gray-500">
                Edit properties for this block (coming soon)
              </p>
            </div>

            <button
              onClick={() => {
                handleRemoveBlock(editingBlockId)
                setEditingBlockId(null)
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition text-sm"
            >
              Delete Block
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Template Selector Component
 */
function TemplateSelector({ onSelect }: { onSelect: (templateId: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["luxury", "mainstream", "specialized", "industry"]
  const templates = selectedCategory
    ? ALL_WEBSITE_TEMPLATES.filter((t) => t.category === selectedCategory)
    : ALL_WEBSITE_TEMPLATES

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose a Template</h1>
          <p className="text-gray-400 text-lg">
            Select a template to get started building your real estate website
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Templates
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-lg font-medium transition capitalize ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition cursor-pointer border border-gray-700 hover:border-blue-500"
              onClick={() => onSelect(template.id)}
            >
              {/* Preview Image */}
              <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-gray-400 group-hover:from-blue-700 group-hover:to-blue-900 transition relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="20" fill="currentColor" />
                    <rect x="10" y="35" width="80" height="50" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                <div className="text-center relative z-10">
                  <p className="text-sm text-gray-300 group-hover:text-gray-200">Preview</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition">
                  {template.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                  <span className="text-xs bg-blue-900 text-blue-200 px-3 py-1 rounded">
                    {template.pages.length} pages
                  </span>
                </div>

                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">
                  Select Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No templates found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
