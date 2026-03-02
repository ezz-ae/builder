"use client"

import { useState, useMemo } from "react"
import { Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlockTemplate } from "./types"
import { ALL_REAL_ESTATE_BLOCKS, BLOCKS_BY_CATEGORY } from "./templates/real-estate-blocks"

interface BlockLibraryProps {
  onAddBlock: (block: BlockTemplate, position?: number) => void
  currentPageBlockCount?: number
}

type BlockCategory = "all" | "hero" | "grid" | "card" | "form" | "agent" | "info" | "header" | "footer"

export function BlockLibrary({ onAddBlock, currentPageBlockCount = 0 }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<BlockCategory>("all")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const filteredBlocks = useMemo(() => {
    let blocks = activeCategory === "all" ? ALL_REAL_ESTATE_BLOCKS : BLOCKS_BY_CATEGORY[activeCategory] || []

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      blocks = blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(query) ||
          block.description.toLowerCase().includes(query) ||
          block.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return blocks
  }, [activeCategory, searchQuery])

  const toggleFavorite = (blockId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(blockId)) {
      newFavorites.delete(blockId)
    } else {
      newFavorites.add(blockId)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Block Library</h3>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as BlockCategory)}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-full justify-start px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 rounded-none overflow-x-auto">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="hero" className="text-xs">
            Hero
          </TabsTrigger>
          <TabsTrigger value="grid" className="text-xs">
            Grid
          </TabsTrigger>
          <TabsTrigger value="card" className="text-xs">
            Card
          </TabsTrigger>
          <TabsTrigger value="form" className="text-xs">
            Form
          </TabsTrigger>
          <TabsTrigger value="agent" className="text-xs">
            Agent
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs">
            Info
          </TabsTrigger>
          <TabsTrigger value="header" className="text-xs">
            Header
          </TabsTrigger>
          <TabsTrigger value="footer" className="text-xs">
            Footer
          </TabsTrigger>
        </TabsList>

        {/* Blocks Grid */}
        <TabsContent value={activeCategory} className="flex-1 overflow-y-auto p-3 m-0">
          {filteredBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">No blocks found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredBlocks.map((block) => (
                <BlockLibraryItem
                  key={block.id}
                  block={block}
                  isFavorite={favorites.has(block.id)}
                  onAdd={() => onAddBlock(block, currentPageBlockCount)}
                  onToggleFavorite={() => toggleFavorite(block.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BlockLibraryItemProps {
  block: BlockTemplate
  isFavorite: boolean
  onAdd: () => void
  onToggleFavorite: () => void
}

function BlockLibraryItem({ block, isFavorite, onAdd, onToggleFavorite }: BlockLibraryItemProps) {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm dark:hover:shadow-gray-900 transition-all bg-gray-50 dark:bg-gray-900 group">
      {/* Preview Image */}
      <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded mb-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">
        {block.previewImage ? (
          <img src={block.previewImage} alt={block.name} className="w-full h-full object-cover rounded" />
        ) : (
          "Preview"
        )}
      </div>

      {/* Content */}
      <div className="mb-2">
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex-1">{block.name}</h4>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className="p-1 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{block.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {block.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {block.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
              +{block.tags.length - 2}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>{block.category}</span>
          {block.responsive && <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium">Responsive</span>}
        </div>
      </div>

      {/* Add Button */}
      <Button onClick={onAdd} size="sm" className="w-full" variant="outline">
        Add Block
      </Button>
    </div>
  )
}
