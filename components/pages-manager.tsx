"use client"

import { useState, useCallback } from "react"
import { Plus, Trash2, Copy, ChevronDown, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Website, Page } from "./types"

interface PagesManagerProps {
  website: Website
  selectedPageId: string | null
  onSelectPage: (pageId: string) => void
  onAddPage: (page: Page) => void
  onDeletePage: (pageId: string) => void
  onClonePage: (pageId: string) => void
  onUpdatePage: (pageId: string, updates: Partial<Page>) => void
}

export function PagesManager({
  website,
  selectedPageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onClonePage,
  onUpdatePage,
}: PagesManagerProps) {
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null)
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null)
  const [newPageTitle, setNewPageTitle] = useState("")

  const handleAddPage = useCallback(() => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: "New Page",
      slug: `new-page-${Date.now()}`,
      blocks: [],
      seo: {
        metaDescription: "",
        keywords: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onAddPage(newPage)
    onSelectPage(newPage.id!)
  }, [onAddPage, onSelectPage])

  const handleStartRename = (page: Page) => {
    setRenamingPageId(page.id!)
    setNewPageTitle(page.title)
  }

  const handleSaveRename = (pageId: string) => {
    if (newPageTitle.trim()) {
      onUpdatePage(pageId, {
        title: newPageTitle,
        slug: newPageTitle.toLowerCase().replace(/\s+/g, "-"),
      })
    }
    setRenamingPageId(null)
    setNewPageTitle("")
  }

  return (
    <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Pages</h2>
        <Button onClick={handleAddPage} size="sm" className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {website.pages.map((page) => (
            <div
              key={page.id!}
              className={`relative group ${
                selectedPageId === page.id!
                  ? "bg-blue-50 dark:bg-blue-950 border-l-2 border-blue-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {/* Page Row */}
              <div
                onClick={() => onSelectPage(page.id!)}
                className="px-4 py-3 cursor-pointer flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  {renamingPageId === page.id! ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={newPageTitle}
                        onChange={(e) => setNewPageTitle(e.target.value)}
                        onBlur={() => handleSaveRename(page.id!)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename(page.id!)
                          if (e.key === "Escape") setRenamingPageId(null)
                        }}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-1"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {page.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {page.blocks.length} blocks
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartRename(page)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    title="Rename page"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedMenuId(expandedMenuId === page.id! ? null : page.id!)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                        expandedMenuId === page.id! ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded Menu */}
              {expandedMenuId === page.id! && (
                <div
                  className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex gap-2 border-t border-gray-200 dark:border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => onClonePage(page.id!)}
                    size="sm"
                    variant="ghost"
                    className="flex-1 justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Clone
                  </Button>
                  <Button
                    onClick={() => {
                      onDeletePage(page.id!)
                      setExpandedMenuId(null)
                    }}
                    size="sm"
                    variant="ghost"
                    className="flex-1 justify-start text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Website Info Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Website</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{website.name}</p>
      </div>
    </div>
  )
}
