"use client"

import { Suspense, lazy } from "react"
import type { BlockInstance, Website, BlockTemplate } from "./types"
import { ALL_BLOCK_TEMPLATES } from "./templates/block-registry"

// Dynamic block components (lazy load)
const HeroBlock = lazy(() => import("./blocks/hero-block").then((m) => ({ default: m.HeroBlock })))
const ListingsGridBlock = lazy(() =>
  import("./blocks/listings-grid-block").then((m) => ({ default: m.ListingsGridBlock })),
)
const ContactFormBlock = lazy(() =>
  import("./blocks/contact-form-block").then((m) => ({ default: m.ContactFormBlock })),
)
const HeaderBlock = lazy(() => import("./blocks/header-block").then((m) => ({ default: m.HeaderBlock })))
const FooterBlock = lazy(() => import("./blocks/footer-block").then((m) => ({ default: m.FooterBlock })))
const AgentGridBlock = lazy(() =>
  import("./blocks/agent-grid-block").then((m) => ({ default: m.AgentGridBlock })),
)
const TestimonialsBlock = lazy(() =>
  import("./blocks/testimonials-block").then((m) => ({ default: m.TestimonialsBlock })),
)
const ListingDetailBlock = lazy(() =>
  import("./blocks/listing-detail-block").then((m) => ({ default: m.ListingDetailBlock })),
)

// Map component names to actual components
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  HeroBlock,
  ListingsGridBlock,
  ContactFormBlock,
  HeaderBlock,
  FooterBlock,
  AgentGridBlock,
  TestimonialsBlock,
  ListingDetailBlock,
}

interface BlockRendererProps {
  block: BlockInstance
  website: Website
  template?: BlockTemplate
  editMode?: boolean
  onSelectBlock?: (blockId: string) => void
  data?: Record<string, unknown>
}

/**
 * BlockRenderer - Renders a single block instance as HTML
 */
export function BlockRenderer({
  block,
  website,
  template,
  editMode = false,
  onSelectBlock,
  data,
}: BlockRendererProps) {
  // Find the block template definition
  const blockTemplate =
    template || ALL_BLOCK_TEMPLATES.find((t) => t.id === block.blockTemplateId)

  if (!blockTemplate) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded text-center text-red-700">
        <p className="font-semibold">Block not found: {block.blockTemplateId}</p>
      </div>
    )
  }

  const Component = BLOCK_COMPONENTS[blockTemplate.component]

  if (!Component) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded text-center text-yellow-700">
        <p className="font-semibold">Component not implemented: {blockTemplate.component}</p>
      </div>
    )
  }

  const blockProps = {
    ...blockTemplate.defaultProps,
    ...block.props,
    settings: website.settings,
  }

  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded" />
      }
    >
      <div
        className={`relative group transition-all ${editMode ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
        onClick={() => editMode && onSelectBlock?.(block.id)}
        role={editMode ? "button" : undefined}
        tabIndex={editMode ? 0 : undefined}
      >
        <Component {...blockProps} data={data} />

        {editMode && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-none">
            {blockTemplate.name}
          </div>
        )}
      </div>
    </Suspense>
  )
}

interface PageRendererProps {
  website: Website
  pageSlug?: string
  editMode?: boolean
  onSelectBlock?: (blockId: string) => void
  data?: Record<string, unknown>
}

/**
 * PageRenderer - Renders a full page from blocks
 */
export function PageRenderer({
  website,
  pageSlug = "home",
  editMode = false,
  onSelectBlock,
  data,
}: PageRendererProps) {
  const page = website.pages.find((p) => p.slug === pageSlug)

  if (!page) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Page not found: {pageSlug}</p>
      </div>
    )
  }

  return (
    <div className={`w-full ${editMode ? "bg-gray-100" : ""}`}>
      {page.blocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          website={website}
          editMode={editMode}
          onSelectBlock={onSelectBlock}
          data={data}
        />
      ))}
    </div>
  )
}

/**
 * WebsiteRenderer - Full website preview
 */
interface WebsiteRendererProps {
  website: Website
  currentPage?: string
  data?: Record<string, unknown>
}

export function WebsiteRenderer({
  website,
  currentPage = "home",
  data,
}: WebsiteRendererProps) {
  return (
    <div className="w-full">
      <PageRenderer
        website={website}
        pageSlug={currentPage}
        data={data}
      />
    </div>
  )
}
