/**
 * Block Registry
 * Central registry of all available block templates
 * Maps block IDs to their definitions and component names
 */

import type { BlockTemplate } from "../types"

// ============================================
// BLOCK TEMPLATES REGISTRY
// ============================================

export const ALL_BLOCK_TEMPLATES: BlockTemplate[] = [
  // HERO BLOCKS
  {
    id: "hero-default",
    name: "Hero Section",
    description: "Large banner with headline, subheading, and CTA button",
    category: "hero",
    component: "HeroBlock",
    requires: [],
    customizable: {
      text: ["title", "subtitle"],
      images: ["backgroundImage"],
      colors: ["primary", "accent"],
      settings: ["layout", "backgroundOverlay"],
    },
    defaultProps: {
      title: "Find Your Dream Property",
      subtitle: "Browse our exclusive selection of homes",
      layout: "center",
      backgroundOverlay: 0.4,
      cta: {
        text: "Start Searching",
        link: "/listings",
      },
    },
    dataBindings: [],
    tags: ["hero", "banner", "landing"],
    createdAt: new Date().toISOString(),
  },

  // LISTINGS BLOCKS
  {
    id: "listings-grid-3col",
    name: "Properties Grid (3 Column)",
    description: "Display properties in a 3-column responsive grid with filtering",
    category: "listings-grid",
    component: "ListingsGridBlock",
    requires: ["listings"],
    customizable: {
      text: ["title", "description"],
      settings: ["columns", "showFilters", "limit"],
    },
    defaultProps: {
      title: "Featured Properties",
      description: "Browse our latest listings",
      columns: 3,
      showFilters: true,
      limit: 12,
      filterByStatus: "active",
    },
    dataBindings: [
      {
        elementKey: "listingCards",
        dataPath: "listings",
        type: "repeater",
      },
    ],
    tags: ["grid", "listings", "properties"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "listings-grid-4col",
    name: "Properties Grid (4 Column)",
    description: "Compact 4-column grid for viewing many listings at once",
    category: "listings-grid",
    component: "ListingsGridBlock",
    requires: ["listings"],
    customizable: {
      text: ["title", "description"],
      settings: ["columns", "showFilters", "limit"],
    },
    defaultProps: {
      title: "All Available Properties",
      columns: 4,
      showFilters: true,
      limit: 16,
    },
    dataBindings: [
      {
        elementKey: "listingCards",
        dataPath: "listings",
        type: "repeater",
      },
    ],
    tags: ["grid", "listings", "compact"],
    createdAt: new Date().toISOString(),
  },

  // LISTING DETAIL
  {
    id: "listing-detail",
    name: "Listing Detail",
    description: "Full property details with images, features, and inquiry form",
    category: "listing-detail",
    component: "ListingDetailBlock",
    requires: ["listing"],
    customizable: {
      colors: ["primary"],
    },
    defaultProps: {},
    dataBindings: [
      {
        elementKey: "price",
        dataPath: "listing.price",
        type: "text",
        formatFn: "formatPrice",
      },
      {
        elementKey: "address",
        dataPath: "listing.address",
        type: "text",
      },
      {
        elementKey: "beds",
        dataPath: "listing.beds",
        type: "text",
      },
      {
        elementKey: "baths",
        dataPath: "listing.baths",
        type: "text",
      },
      {
        elementKey: "sqft",
        dataPath: "listing.sqft",
        type: "text",
        formatFn: "formatNumber",
      },
      {
        elementKey: "description",
        dataPath: "listing.description",
        type: "text",
      },
      {
        elementKey: "mainImage",
        dataPath: "listing.images[0]",
        type: "image",
      },
    ],
    tags: ["detail", "listing", "property"],
    createdAt: new Date().toISOString(),
  },

  // AGENT BLOCKS
  {
    id: "agent-grid",
    name: "Agent Team Grid",
    description: "Display agents/team members in a responsive grid",
    category: "agent-grid",
    component: "AgentGridBlock",
    requires: ["agents"],
    customizable: {
      text: ["title"],
      settings: ["columns"],
    },
    defaultProps: {
      title: "Our Team",
      columns: 3,
    },
    dataBindings: [
      {
        elementKey: "agentCards",
        dataPath: "agents",
        type: "repeater",
      },
    ],
    tags: ["agents", "team", "grid"],
    createdAt: new Date().toISOString(),
  },

  // CONTACT & FORM BLOCKS
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Inquiry form with contact information",
    category: "contact-form",
    component: "ContactFormBlock",
    requires: [],
    customizable: {
      text: ["title", "subtitle"],
      settings: ["showPhone", "showAddress"],
    },
    defaultProps: {
      title: "Get In Touch",
      subtitle: "We'd love to hear from you",
      showPhone: true,
      showAddress: true,
    },
    dataBindings: [],
    tags: ["form", "contact", "lead"],
    createdAt: new Date().toISOString(),
  },

  // TESTIMONIALS
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Client testimonials carousel",
    category: "testimonials",
    component: "TestimonialsBlock",
    requires: [],
    customizable: {
      text: ["title"],
    },
    defaultProps: {
      title: "What Our Clients Say",
    },
    dataBindings: [],
    tags: ["testimonials", "social-proof", "reviews"],
    createdAt: new Date().toISOString(),
  },

  // HEADER & FOOTER
  {
    id: "header-sticky",
    name: "Sticky Header",
    description: "Navigation header with logo and menu",
    category: "header",
    component: "HeaderBlock",
    requires: [],
    customizable: {
      colors: ["primary"],
    },
    defaultProps: {
      pages: [
        { slug: "home", title: "Home" },
        { slug: "listings", title: "Listings" },
        { slug: "about", title: "About" },
        { slug: "contact", title: "Contact" },
      ],
    },
    dataBindings: [],
    tags: ["header", "navigation", "sticky"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "footer-default",
    name: "Footer",
    description: "Footer with company info, links, and newsletter signup",
    category: "footer",
    component: "FooterBlock",
    requires: [],
    customizable: {
      colors: ["primary"],
      settings: ["showSocial", "showNewsletter"],
    },
    defaultProps: {
      showSocial: true,
      showNewsletter: true,
    },
    dataBindings: [],
    tags: ["footer", "contact", "newsletter"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// CATEGORY LOOKUP
// ============================================

export const BLOCKS_BY_CATEGORY = ALL_BLOCK_TEMPLATES.reduce(
  (acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = []
    }
    acc[block.category].push(block)
    return acc
  },
  {} as Record<string, BlockTemplate[]>,
)

// ============================================
// TEMPLATE PRESETS (Pages that use these blocks)
// ============================================

export const PAGE_TEMPLATES = {
  home: {
    name: "Home Page",
    blocks: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "testimonials",
      "contact-form",
      "footer-default",
    ],
  },
  listings: {
    name: "Listings Page",
    blocks: [
      "header-sticky",
      "hero-default",
      "listings-grid-4col",
      "footer-default",
    ],
  },
  listing_detail: {
    name: "Listing Detail",
    blocks: [
      "header-sticky",
      "listing-detail",
      "agent-grid",
      "testimonials",
      "contact-form",
      "footer-default",
    ],
  },
  about: {
    name: "About Page",
    blocks: [
      "header-sticky",
      "hero-default",
      "agent-grid",
      "testimonials",
      "footer-default",
    ],
  },
  contact: {
    name: "Contact Page",
    blocks: [
      "header-sticky",
      "hero-default",
      "contact-form",
      "footer-default",
    ],
  },
}

// Helper functions
export function getBlockTemplate(id: string): BlockTemplate | undefined {
  return ALL_BLOCK_TEMPLATES.find((b) => b.id === id)
}

export function getBlocksByCategory(category: string): BlockTemplate[] {
  return BLOCKS_BY_CATEGORY[category] || []
}

export function getPageTemplate(pageType: string) {
  return PAGE_TEMPLATES[pageType as keyof typeof PAGE_TEMPLATES]
}

export function searchBlocks(query: string): BlockTemplate[] {
  const q = query.toLowerCase()
  return ALL_BLOCK_TEMPLATES.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q)),
  )
}
