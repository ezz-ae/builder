import { Client } from "@neondatabase/serverless"
import type { InventoryItem } from "@/components/types"

export interface Property {
  id: string
  agencyId: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  description: string
  images: string[]
  status: "active" | "pending" | "sold"
  agentId?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  agencyId: string
  name: string
  title: string
  email: string
  phone: string
  imageUrl: string
  bio: string
  license?: string
  specialties?: string[]
  createdAt: string
}

export interface Agency {
  id: string
  name: string
  email: string
  phone: string
  address: string
  logoUrl: string
  website?: string
  description?: string
  createdAt: string
}

export interface Website {
  id: string
  agencyId: string
  name: string
  slug: string
  configJson: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface MarketInsights {
  marketTrend: string
  averagePrice: number
  priceRange: { min: number; max: number }
  populationGrowth: number
  averageDaysOnMarket: number
  schoolRating?: number
  crimeRate?: string
  walkscore?: number
  topNeighborhoodTraits: string[]
}

export interface ListingAnalysis {
  pricePerSqft: number
  priceHistory: Array<{ date: string; price: number }>
  marketTrend: "up" | "stable" | "down"
  daysOnMarket: number
  priceReduction?: number
  similarListings: number
  investmentScore?: number
  insights: string[]
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    agencyId: "demo-agency",
    address: "123 Market Street, San Francisco, CA 94105",
    price: 2500000,
    beds: 4,
    baths: 3,
    sqft: 3500,
    description: "Stunning Victorian home with updated interiors",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    ],
    status: "active",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prop-2",
    agencyId: "demo-agency",
    address: "456 Mission Avenue, San Francisco, CA 94103",
    price: 1800000,
    beds: 3,
    baths: 2.5,
    sqft: 2800,
    description: "Modern apartment with city views",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9884d0c60cbd?w=600&h=400&fit=crop",
    ],
    status: "active",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prop-3",
    agencyId: "demo-agency",
    address: "789 Valencia Street, San Francisco, CA 94110",
    price: 1500000,
    beds: 2,
    baths: 2,
    sqft: 1900,
    description: "Charming Victorian conversion",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78991c7c0dee?w=600&h=400&fit=crop",
    ],
    status: "active",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    agencyId: "demo-agency",
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    email: "sarah@example.com",
    phone: "(555) 123-4567",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "With over 10 years of experience, Sarah specializes in luxury homes.",
    license: "CA-RE-12345",
    specialties: ["Luxury Homes", "Victorian Properties", "Investment Properties"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "agent-2",
    agencyId: "demo-agency",
    name: "Michael Chen",
    title: "Real Estate Agent",
    email: "michael@example.com",
    phone: "(555) 234-5678",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Michael helps first-time home buyers find their dream homes.",
    license: "CA-RE-12346",
    specialties: ["First-Time Buyers", "Starter Homes"],
    createdAt: new Date().toISOString(),
  },
]

const MOCK_AGENCY: Agency = {
  id: "demo-agency",
  name: "Premier Real Estate",
  email: "info@premierrealestate.com",
  phone: "(555) 100-1234",
  address: "100 Main Street, San Francisco, CA 94105",
  logoUrl: "https://via.placeholder.com/200x60?text=Premier+RE",
  website: "https://premierrealestate.com",
  description: "San Francisco's leading real estate agency since 2010",
  createdAt: new Date().toISOString(),
}

const MOCK_WEBSITE: Website = {
  id: "demo-site",
  agencyId: "demo-agency",
  name: "Premier Real Estate Website",
  slug: "premier-real-estate",
  configJson: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const MOCK_INVENTORY: InventoryItem[] = MOCK_PROPERTIES.map((property) => ({
  id: property.id,
  agencyId: property.agencyId,
  propertyName: property.address,
  address: property.address,
  price: property.price,
  beds: property.beds,
  baths: property.baths,
  sqft: property.sqft,
  status: property.status,
  heroImage: property.images[0],
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
}))

const DATABASE_URL = process.env.DATABASE_URL?.trim()
const DEFAULT_LIMIT = 50

let clientInstance: Client | null = null
let clientPromise: Promise<Client> | null = null

async function getClient(): Promise<Client> {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  if (clientInstance) {
    return clientInstance
  }

  if (!clientPromise) {
    clientPromise = (async () => {
      const client = new Client({ connectionString: DATABASE_URL })
      await client.connect()
      clientInstance = client
      return client
    })()
  }

  return clientPromise
}

function parseStringArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map(String)
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }
    return []
  }
  return []
}

function normalizePropertyRow(row: Record<string, unknown>, agencyId?: string): Property {
  const price = Number(row.price ?? row.list_price ?? 0)
  const status = String(row.status ?? "active").toLowerCase()
  const createdAt = row.created_at || row.createdAt || new Date().toISOString()
  const updatedAt = row.updated_at || row.updatedAt || new Date().toISOString()

  return {
    id: String(row.id ?? row.property_id ?? `${agencyId ?? "demo-agency"}-${Math.random().toString(16).slice(2)}`),
    agencyId: String(row.agency_id ?? row.agencyId ?? agencyId ?? "demo-agency"),
    address: String(row.address ?? row.location ?? "Unknown address"),
    price,
    beds: Number(row.beds ?? row.bedrooms ?? 0),
    baths: Number(row.baths ?? row.bathrooms ?? 0),
    sqft: Number(row.sqft ?? row.square_feet ?? 0),
    description: String(row.description ?? row.summary ?? ""),
    images: parseStringArray(row.images ?? row.image_urls ?? row.photos),
    status: status === "sold" ? "sold" : status === "pending" ? "pending" : "active",
    agentId: row.agent_id ? String(row.agent_id) : row.agentId ? String(row.agentId) : undefined,
    featured: Boolean(row.featured),
    createdAt: new Date(createdAt as string).toISOString(),
    updatedAt: new Date(updatedAt as string).toISOString(),
  }
}

function normalizeAgentRow(row: Record<string, unknown>, agencyId?: string): Agent {
  const createdAt = row.created_at || row.createdAt || new Date().toISOString()
  const licenseValue = row.license ?? row.license_number
  const specialtiesValue = Array.isArray(row.specialties)
    ? (row.specialties as string[])
    : row.specialty
    ? [String(row.specialty)]
    : undefined

  return {
    id: String(row.id ?? row.agent_id ?? `${agencyId ?? "demo-agency"}-agent-${Math.random().toString(16).slice(2)}`),
    agencyId: String(row.agency_id ?? row.agencyId ?? agencyId ?? "demo-agency"),
    name: String(row.name ?? row.full_name ?? "Agent"),
    title: String(row.title ?? row.role ?? "Real Estate Agent"),
    email: String(row.email ?? row.contact_email ?? ""),
    phone: String(row.phone ?? row.contact_phone ?? ""),
    imageUrl: String(
      row.image_url ?? row.imageUrl ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    ),
    bio: String(row.bio ?? row.description ?? ""),
    license: licenseValue ? String(licenseValue) : undefined,
    specialties: specialtiesValue,
    createdAt: new Date(createdAt as string).toISOString(),
  }
}

function normalizeAgencyRow(row: Record<string, unknown>): Agency {
  const createdAt = row.created_at || row.createdAt || new Date().toISOString()
  const websiteValue = row.website ?? row.website_url

  return {
    id: String(row.id ?? row.agency_id ?? "demo-agency"),
    name: String(row.name ?? row.company_name ?? "Real Estate Agency"),
    email: String(row.email ?? row.contact_email ?? "info@example.com"),
    phone: String(row.phone ?? row.contact_phone ?? "(555) 000-0000"),
    address: String(row.address ?? row.location ?? "Unknown"),
    logoUrl: String(row.logo_url ?? row.logoUrl ?? "https://via.placeholder.com/200x60?text=Logo"),
    website: websiteValue ? String(websiteValue) : undefined,
    description: String(row.description ?? row.about ?? ""),
    createdAt: new Date(createdAt as string).toISOString(),
  }
}

function normalizeWebsiteRow(row: Record<string, unknown>): Website {
  const createdAt = row.created_at || row.createdAt || new Date().toISOString()
  const updatedAt = row.updated_at || row.updatedAt || new Date().toISOString()

  return {
    id: String(row.id ?? row.website_id ?? "demo-site"),
    agencyId: String(row.agency_id ?? row.agencyId ?? "demo-agency"),
    name: String(row.name ?? row.title ?? "Generated Website"),
    slug: String(row.slug ?? row.path ?? "generated-website"),
    configJson: (row.config_json ?? row.configJson ?? {}) as Record<string, unknown>,
    createdAt: new Date(createdAt as string).toISOString(),
    updatedAt: new Date(updatedAt as string).toISOString(),
  }
}

export interface PropertyFilter {
  agencyId: string
  search?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  status?: "active" | "pending" | "sold"
  featured?: boolean
  limit?: number
}

async function queryPropertiesFromNeon(filters: PropertyFilter): Promise<Property[]> {
  if (!DATABASE_URL) {
    return []
  }

  const client = await getClient()
  const values: unknown[] = [filters.agencyId]
  const clauses = ["agency_id = $1"]

  if (filters.status) {
    values.push(filters.status)
    clauses.push(`status = $${values.length}`)
  }

  if (filters.featured) {
    values.push(true)
    clauses.push(`featured = $${values.length}`)
  }

  if (filters.minPrice !== undefined) {
    values.push(filters.minPrice)
    clauses.push(`price >= $${values.length}`)
  }

  if (filters.maxPrice !== undefined) {
    values.push(filters.maxPrice)
    clauses.push(`price <= $${values.length}`)
  }

  if (filters.beds !== undefined) {
    values.push(filters.beds)
    clauses.push(`beds = $${values.length}`)
  }

  if (filters.baths !== undefined) {
    values.push(filters.baths)
    clauses.push(`baths = $${values.length}`)
  }

  if (filters.search) {
    values.push(`%${filters.search.toLowerCase()}%`)
    clauses.push(
      `(LOWER(address) LIKE $${values.length} OR LOWER(description) LIKE $${values.length})`,
    )
  }

  const limit = filters.limit ?? DEFAULT_LIMIT
  const query = `
    SELECT id, agency_id, address, price, beds, baths, sqft, description, images, status, agent_id, featured, created_at, updated_at
    FROM properties
    WHERE ${clauses.join(" AND ")}
    ORDER BY featured DESC, updated_at DESC
    LIMIT $${values.length + 1}
  `

  values.push(limit)

  try {
    const { rows } = await client.query(query, values)
    return rows.map((row) => normalizePropertyRow(row, filters.agencyId))
  } catch (error) {
    console.error("Neon query error (properties):", error)
    return []
  }
}

async function queryAgentsFromNeon(agencyId: string): Promise<Agent[]> {
  if (!DATABASE_URL) {
    return []
  }

  const client = await getClient()
  const query = `
    SELECT id, agency_id, name, title, email, phone, image_url, bio, license, specialties, created_at
    FROM agents
    WHERE agency_id = $1
    ORDER BY created_at DESC
  `

  try {
    const { rows } = await client.query(query, [agencyId])
    return rows.map((row) => normalizeAgentRow(row, agencyId))
  } catch (error) {
    console.error("Neon query error (agents):", error)
    return []
  }
}

async function queryAgencyFromNeon(agencyId: string): Promise<Agency | null> {
  if (!DATABASE_URL) {
    return null
  }

  const client = await getClient()
  const query = `
    SELECT id, agency_id, name, email, phone, address, logo_url, website, description, created_at
    FROM agencies
    WHERE agency_id = $1 OR id = $1
    LIMIT 1
  `

  try {
    const { rows } = await client.query(query, [agencyId])
    if (!rows.length) return null
    return normalizeAgencyRow(rows[0])
  } catch (error) {
    console.error("Neon query error (agency):", error)
    return null
  }
}

async function queryWebsiteFromNeon(websiteId: string): Promise<Website | null> {
  if (!DATABASE_URL) {
    return null
  }

  const client = await getClient()
  const query = `
    SELECT id, agency_id, name, slug, config_json, created_at, updated_at
    FROM websites
    WHERE id = $1 OR slug = $1
    LIMIT 1
  `

  try {
    const { rows } = await client.query(query, [websiteId])
    if (!rows.length) return null
    return normalizeWebsiteRow(rows[0])
  } catch (error) {
    console.error("Neon query error (websites):", error)
    return null
  }
}

async function updateWebsiteConfigInNeon(websiteId: string, config: Record<string, unknown>): Promise<Website | null> {
  if (!DATABASE_URL) {
    return null
  }

  const client = await getClient()
  const query = `
    INSERT INTO websites (id, config_json, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (id) DO UPDATE SET config_json = EXCLUDED.config_json, updated_at = NOW()
    RETURNING id, agency_id, name, slug, config_json, created_at, updated_at
  `

  try {
    const { rows } = await client.query(query, [websiteId, config])
    if (!rows.length) return null
    return normalizeWebsiteRow(rows[0])
  } catch (error) {
    console.error("Neon query error (update website):", error)
    return null
  }
}

function filterMockProperties(agencyId: string, filters: PropertyFilter): Property[] {
  return MOCK_PROPERTIES.filter((property) => {
    if (filters.status && property.status !== filters.status) return false
    if (filters.featured && !property.featured) return false
    if (filters.beds !== undefined && property.beds !== filters.beds) return false
    if (filters.baths !== undefined && property.baths !== filters.baths) return false
    if (filters.minPrice !== undefined && property.price < filters.minPrice) return false
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) return false
    if (filters.search) {
      const query = filters.search.toLowerCase()
      if (!property.address.toLowerCase().includes(query) && !property.description.toLowerCase().includes(query)) {
        return false
      }
    }
    return true
  })
}

export async function searchProperties(filters: PropertyFilter): Promise<Property[]> {
  const dbResults = await queryPropertiesFromNeon(filters)
  if (dbResults.length > 0) {
    return dbResults
  }

  const fallback = filterMockProperties(filters.agencyId, filters)
  return fallback.slice(0, filters.limit ?? DEFAULT_LIMIT)
}

export async function getProperties(agencyId: string): Promise<Property[]> {
  return searchProperties({ agencyId, limit: DEFAULT_LIMIT })
}

export async function getAgentProperties(agentId: string, agencyId: string): Promise<Property[]> {
  const properties = await searchProperties({ agencyId, limit: DEFAULT_LIMIT })
  return properties.filter((property) => property.agentId === agentId)
}

export async function getAgents(agencyId: string): Promise<Agent[]> {
  const dbResults = await queryAgentsFromNeon(agencyId)
  return dbResults.length > 0 ? dbResults : MOCK_AGENTS.map((agent) => ({ ...agent, agencyId }))
}

export async function getAgent(agentId: string, agencyId: string): Promise<Agent | null> {
  const agents = await getAgents(agencyId)
  return agents.find((agent) => agent.id === agentId) || null
}

export async function getAgency(agencyId: string): Promise<Agency | null> {
  const dbResult = await queryAgencyFromNeon(agencyId)
  return dbResult ?? { ...MOCK_AGENCY, id: agencyId }
}

export async function getWebsite(websiteId: string): Promise<Website | null> {
  const dbResult = await queryWebsiteFromNeon(websiteId)
  return dbResult ?? { ...MOCK_WEBSITE, id: websiteId }
}

export async function updateWebsite(websiteId: string, config: Record<string, unknown>): Promise<Website | null> {
  const dbResult = await updateWebsiteConfigInNeon(websiteId, config)
  return dbResult ?? { ...MOCK_WEBSITE, id: websiteId, configJson: config, updatedAt: new Date().toISOString() }
}

export interface AgencyStats {
  totalProperties: number
  activeListings: number
  soldLastMonth: number
  totalAgents: number
  averagePrice: number
}

export async function getAgencyStats(agencyId: string): Promise<AgencyStats> {
  if (DATABASE_URL) {
    try {
      const client = await getClient()
      const statsQuery = `
        SELECT
          COUNT(*)::int AS total_properties,
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_listings,
          COUNT(*) FILTER (WHERE status = 'sold' AND updated_at >= NOW() - INTERVAL '30 days')::int AS sold_last_month,
          AVG(price)::numeric AS average_price
        FROM properties
        WHERE agency_id = $1
      `
      const agentCountQuery = `
        SELECT COUNT(*)::int AS total_agents FROM agents WHERE agency_id = $1
      `
      const statsResult = await client.query(statsQuery, [agencyId])
      const agentCountResult = await client.query(agentCountQuery, [agencyId])

      const statsRow = statsResult.rows[0] ?? {}
      return {
        totalProperties: Number(statsRow.total_properties ?? 0),
        activeListings: Number(statsRow.active_listings ?? 0),
        soldLastMonth: Number(statsRow.sold_last_month ?? 0),
        totalAgents: Number(agentCountResult.rows[0]?.total_agents ?? 0),
        averagePrice: Number(statsRow.average_price ?? 0),
      }
    } catch (error) {
      console.error("Neon query error (agency stats):", error)
    }
  }

  const properties = await searchProperties({ agencyId, limit: DEFAULT_LIMIT })
  const agents = await getAgents(agencyId)
  const activeProperties = properties.filter((prop) => prop.status === "active")
  const soldLastMonth = properties.filter((prop) =>
    new Date(prop.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 && prop.status === "sold",
  ).length

  return {
    totalProperties: properties.length,
    activeListings: activeProperties.length,
    soldLastMonth,
    totalAgents: agents.length,
    averagePrice: properties.length > 0 ? Math.round(properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length) : 0,
  }
}

export interface InventoryFilter {
  agencyId?: string
  status?: string
  limit?: number
}

function normalizeInventoryRow(row: Record<string, unknown>, agencyId?: string): InventoryItem {
  const createdAt = row.created_at || row.createdAt || new Date().toISOString()
  const updatedAt = row.updated_at || row.updatedAt || new Date().toISOString()
  const propertyName =
    (row.project_name as string) ||
    (row.property_name as string) ||
    (row.name as string) ||
    (row.title as string) ||
    (row.address as string) ||
    "Inventory Item"
  const heroImage = (row.hero_image_url as string) || (row.hero_image as string) || (row.cover_image as string)

  return {
    id: String(row.id ?? row.project_id ?? `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(16).slice(2)}`),
    agencyId: String(row.agency_id ?? row.agencyId ?? agencyId ?? "demo-agency"),
    propertyName,
    address: String(row.address ?? ""),
    price: Number(row.price ?? row.list_price ?? 0),
    beds: Number(row.beds ?? row.bedrooms ?? 0) || undefined,
    baths: Number(row.baths ?? row.bathrooms ?? 0) || undefined,
    sqft: Number(row.sqft ?? row.square_feet ?? row.size ?? 0) || undefined,
    status: String(row.status ?? row.inventory_status ?? "active"),
    heroImage: heroImage || undefined,
    createdAt: new Date(createdAt as string).toISOString(),
    updatedAt: new Date(updatedAt as string).toISOString(),
  }
}

async function queryInventoryFromTable(table: string, filters: InventoryFilter): Promise<InventoryItem[]> {
  if (!DATABASE_URL) {
    return []
  }

  const client = await getClient()
  const clauses: string[] = []
  const values: unknown[] = []

  if (filters.agencyId) {
    values.push(filters.agencyId)
    clauses.push(`agency_id = $${values.length}`)
  }

  if (filters.status) {
    values.push(filters.status)
    clauses.push(`status = $${values.length}`)
  }

  const limit = filters.limit ?? DEFAULT_LIMIT
  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : ""
  const query = `
    SELECT id, agency_id, project_name, property_name, name, address, price, beds, bedrooms, baths, bathrooms, sqft, square_feet, size,
      status, inventory_status, hero_image_url, hero_image, cover_image, created_at, updated_at
    FROM ${table}
    ${whereClause}
    ORDER BY updated_at DESC NULLS LAST
    LIMIT $${values.length + 1}
  `
  values.push(limit)

  try {
    const { rows } = await client.query(query, values)
    return rows.map((row) => normalizeInventoryRow(row, filters.agencyId))
  } catch (error) {
    console.error(`Neon query error (${table}):`, error)
    return []
  }
}

async function queryInventoryFromNeon(filters: InventoryFilter): Promise<InventoryItem[]> {
  const tables = ["inventory_full", "entrestaet_master", "pf_inventory", "projects"]
  for (const table of tables) {
    const rows = await queryInventoryFromTable(table, filters)
    if (rows.length > 0) {
      return rows
    }
  }
  return []
}

export async function getInventoryItems(filters: InventoryFilter = {}): Promise<InventoryItem[]> {
  const dbResults = await queryInventoryFromNeon(filters)
  if (dbResults.length > 0) {
    return dbResults
  }

  return MOCK_INVENTORY.slice(0, filters.limit ?? DEFAULT_LIMIT)
}

const MARKET_TABLES = ["inventory_full", "pf_inventory"] as const
const MARKET_COLUMN_CANDIDATES = {
  address: ["address", "location", "project_name", "property_name", "name", "title", "community", "district", "area", "neighborhood", "city"],
  price: ["price", "list_price", "listing_price", "ask_price"],
  sqft: ["sqft", "square_feet", "size", "area_sqft"],
  date: ["updated_at", "created_at", "listed_at", "listing_date", "last_updated"],
  daysOnMarket: ["days_on_market", "dom"],
}

const marketColumnCache = new Map<string, Set<string>>()

async function getTableColumns(table: string): Promise<Set<string>> {
  const cached = marketColumnCache.get(table)
  if (cached) return cached

  if (!DATABASE_URL) {
    return new Set()
  }

  const client = await getClient()
  try {
    const { rows } = await client.query(
      `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
      `,
      [table],
    )
    const columns = new Set(rows.map((row) => String(row.column_name)))
    marketColumnCache.set(table, columns)
    return columns
  } catch (error) {
    console.error(`Neon schema error (${table}):`, error)
    return new Set()
  }
}

function buildTextCoalesceExpr(columns: Set<string>, candidates: string[]): string | null {
  const available = candidates.filter((column) => columns.has(column))
  if (available.length === 0) return null
  const expressions = available.map((column) => `${column}::text`)
  return expressions.length === 1 ? expressions[0] : `COALESCE(${expressions.join(", ")})`
}

function numericExpression(column: string): string {
  return `NULLIF(regexp_replace(${column}::text, '[^0-9.]', '', 'g'), '')::numeric`
}

function buildNumericCoalesceExpr(columns: Set<string>, candidates: string[]): string | null {
  const available = candidates.filter((column) => columns.has(column))
  if (available.length === 0) return null
  const expressions = available.map((column) => numericExpression(column))
  return expressions.length === 1 ? expressions[0] : `COALESCE(${expressions.join(", ")})`
}

function buildDateCoalesceExpr(columns: Set<string>, candidates: string[]): string | null {
  const available = candidates.filter((column) => columns.has(column))
  if (available.length === 0) return null
  const expressions = available.map((column) => `${column}::timestamptz`)
  return expressions.length === 1 ? expressions[0] : `COALESCE(${expressions.join(", ")})`
}

function normalizeSearchTerm(address: string): string {
  const trimmed = address.trim()
  if (!trimmed) return ""
  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean)
  if (parts.length > 0 && parts[0].length > 2) {
    return parts[0]
  }
  return trimmed
}

function computeTrend(avgRecent?: number | null, avgPrev?: number | null) {
  if (!avgRecent || !avgPrev || avgPrev === 0) {
    return { label: "Stable pricing", direction: "stable" as const, changePct: 0 }
  }
  const changePct = ((avgRecent - avgPrev) / avgPrev) * 100
  if (changePct > 3) {
    return { label: `Rising prices (+${changePct.toFixed(1)}%)`, direction: "up" as const, changePct }
  }
  if (changePct < -3) {
    return { label: `Softening prices (${changePct.toFixed(1)}%)`, direction: "down" as const, changePct }
  }
  return { label: "Stable pricing", direction: "stable" as const, changePct }
}

function buildTraits(params: {
  averagePrice?: number | null
  avgDaysOnMarket?: number | null
  avgPricePerSqft?: number | null
  similarListings?: number | null
}) {
  const traits: string[] = []
  const averagePrice = params.averagePrice ?? 0
  const avgDaysOnMarket = params.avgDaysOnMarket ?? 0
  const avgPricePerSqft = params.avgPricePerSqft ?? 0
  const similarListings = params.similarListings ?? 0

  if (avgDaysOnMarket > 0 && avgDaysOnMarket <= 30) traits.push("Fast-moving inventory")
  if (avgDaysOnMarket >= 90) traits.push("Longer selling cycles")
  if (averagePrice >= 5000000) traits.push("Ultra-luxury pricing")
  if (averagePrice >= 2000000 && averagePrice < 5000000) traits.push("Prime price band")
  if (avgPricePerSqft >= 1000) traits.push("Premium price per sqft")
  if (similarListings >= 50) traits.push("Deep comparable inventory")
  if (similarListings > 0 && similarListings < 15) traits.push("Limited comparable stock")

  if (traits.length === 0) {
    traits.push("Active inventory", "Market-ready listings", "Neighborhood demand")
  }
  return traits.slice(0, 4)
}

type MarketAggregate = {
  avgPrice: number | null
  minPrice: number | null
  maxPrice: number | null
  avgDaysOnMarket: number | null
  avgRecentPrice: number | null
  avgPrevPrice: number | null
  avgPricePerSqft: number | null
  avgSqft: number | null
  recentCount: number | null
  prevCount: number | null
  similarCount: number | null
  priceHistory: Array<{ date: string; price: number }>
}

async function queryMarketAggregate(address: string, price?: number): Promise<MarketAggregate | null> {
  if (!DATABASE_URL) {
    return null
  }

  const client = await getClient()
  const searchTerm = normalizeSearchTerm(address)
  if (!searchTerm) return null
  const likePattern = `%${searchTerm}%`

  for (const table of MARKET_TABLES) {
    const columns = await getTableColumns(table)
    if (columns.size === 0) continue

    const searchExpr = buildTextCoalesceExpr(columns, MARKET_COLUMN_CANDIDATES.address)
    const priceExpr = buildNumericCoalesceExpr(columns, MARKET_COLUMN_CANDIDATES.price)

    if (!searchExpr || !priceExpr) continue

    const sqftExpr = buildNumericCoalesceExpr(columns, MARKET_COLUMN_CANDIDATES.sqft)
    const dateExpr = buildDateCoalesceExpr(columns, MARKET_COLUMN_CANDIDATES.date)
    const domExpr = buildNumericCoalesceExpr(columns, MARKET_COLUMN_CANDIDATES.daysOnMarket)
    const daysExpr = domExpr ?? (dateExpr ? `EXTRACT(DAY FROM (NOW() - ${dateExpr}))` : null)

    const avgRecentExpr = dateExpr
      ? `AVG(${priceExpr}) FILTER (WHERE ${dateExpr} >= NOW() - INTERVAL '90 days')`
      : "NULL"
    const avgPrevExpr = dateExpr
      ? `AVG(${priceExpr}) FILTER (WHERE ${dateExpr} >= NOW() - INTERVAL '180 days' AND ${dateExpr} < NOW() - INTERVAL '90 days')`
      : "NULL"
    const recentCountExpr = dateExpr
      ? `COUNT(*) FILTER (WHERE ${dateExpr} >= NOW() - INTERVAL '90 days')`
      : "NULL"
    const prevCountExpr = dateExpr
      ? `COUNT(*) FILTER (WHERE ${dateExpr} >= NOW() - INTERVAL '180 days' AND ${dateExpr} < NOW() - INTERVAL '90 days')`
      : "NULL"
    const avgPricePerSqftExpr = sqftExpr ? `AVG(${priceExpr} / NULLIF(${sqftExpr}, 0))` : "NULL"
    const avgSqftExpr = sqftExpr ? `AVG(${sqftExpr})` : "NULL"

    const values: unknown[] = [likePattern]
    let similarCountExpr = "NULL"
    if (typeof price === "number" && Number.isFinite(price)) {
      values.push(price * 0.9, price * 1.1)
      similarCountExpr = `COUNT(*) FILTER (WHERE ${priceExpr} BETWEEN $2 AND $3)`
    }

    const aggregateQuery = `
      SELECT
        AVG(${priceExpr})::numeric AS avg_price,
        MIN(${priceExpr})::numeric AS min_price,
        MAX(${priceExpr})::numeric AS max_price,
        ${daysExpr ? `AVG(${daysExpr})::numeric` : "NULL"} AS avg_days,
        ${avgRecentExpr}::numeric AS avg_recent,
        ${avgPrevExpr}::numeric AS avg_prev,
        ${avgPricePerSqftExpr}::numeric AS avg_price_per_sqft,
        ${avgSqftExpr}::numeric AS avg_sqft,
        ${recentCountExpr}::int AS recent_count,
        ${prevCountExpr}::int AS prev_count,
        ${similarCountExpr}::int AS similar_count,
        COUNT(*)::int AS total_count
      FROM ${table}
      WHERE ${priceExpr} IS NOT NULL
        AND ${searchExpr} ILIKE $1
    `

    try {
      const aggregateResult = await client.query(aggregateQuery, values)
      const row = aggregateResult.rows[0]
      if (!row || Number(row.total_count ?? 0) === 0) continue

      let priceHistory: Array<{ date: string; price: number }> = []
      if (dateExpr) {
        const historyQuery = `
          SELECT date_trunc('month', ${dateExpr}) AS month, AVG(${priceExpr})::numeric AS avg_price
          FROM ${table}
          WHERE ${priceExpr} IS NOT NULL
            AND ${dateExpr} IS NOT NULL
            AND ${searchExpr} ILIKE $1
          GROUP BY 1
          ORDER BY 1 DESC
          LIMIT 3
        `
        const historyResult = await client.query(historyQuery, [likePattern])
        priceHistory = historyResult.rows
          .filter((entry) => entry.month && entry.avg_price)
          .map((entry) => ({
            date: new Date(entry.month as string).toISOString(),
            price: Number(entry.avg_price),
          }))
          .reverse()
      }

      return {
        avgPrice: row.avg_price ? Number(row.avg_price) : null,
        minPrice: row.min_price ? Number(row.min_price) : null,
        maxPrice: row.max_price ? Number(row.max_price) : null,
        avgDaysOnMarket: row.avg_days ? Number(row.avg_days) : null,
        avgRecentPrice: row.avg_recent ? Number(row.avg_recent) : null,
        avgPrevPrice: row.avg_prev ? Number(row.avg_prev) : null,
        avgPricePerSqft: row.avg_price_per_sqft ? Number(row.avg_price_per_sqft) : null,
        avgSqft: row.avg_sqft ? Number(row.avg_sqft) : null,
        recentCount: row.recent_count ? Number(row.recent_count) : null,
        prevCount: row.prev_count ? Number(row.prev_count) : null,
        similarCount: row.similar_count ? Number(row.similar_count) : null,
        priceHistory,
      }
    } catch (error) {
      console.error(`Neon market query error (${table}):`, error)
    }
  }

  return null
}

export async function getMarketInsights(address: string): Promise<MarketInsights> {
  const aggregate = await queryMarketAggregate(address)
  const avgPrice = aggregate?.avgPrice ?? 0
  const minPrice = aggregate?.minPrice ?? 0
  const maxPrice = aggregate?.maxPrice ?? 0
  const avgDaysOnMarket = aggregate?.avgDaysOnMarket ?? 0
  const trend = computeTrend(aggregate?.avgRecentPrice, aggregate?.avgPrevPrice)
  const populationGrowth = aggregate?.recentCount && aggregate?.prevCount && aggregate.prevCount > 0
    ? Number((((aggregate.recentCount - aggregate.prevCount) / aggregate.prevCount) * 100).toFixed(1))
    : 0
  const traits = buildTraits({
    averagePrice: avgPrice,
    avgDaysOnMarket,
    avgPricePerSqft: aggregate?.avgPricePerSqft ?? null,
    similarListings: aggregate?.similarCount ?? null,
  })

  return {
    marketTrend: trend.label,
    averagePrice: avgPrice,
    priceRange: { min: minPrice, max: maxPrice },
    populationGrowth,
    averageDaysOnMarket: Math.round(avgDaysOnMarket),
    walkscore: undefined,
    topNeighborhoodTraits: traits,
  }
}

export async function getMarketListingAnalysis(address: string, price: number): Promise<ListingAnalysis> {
  const aggregate = await queryMarketAggregate(address, price)
  const avgDaysOnMarket = aggregate?.avgDaysOnMarket ?? 0
  const avgPricePerSqft = aggregate?.avgPricePerSqft ?? null
  const avgSqft = aggregate?.avgSqft ?? null
  const derivedPricePerSqft = avgSqft && avgSqft > 0 ? price / avgSqft : avgPricePerSqft ?? 0
  const similarListings = aggregate?.similarCount ?? 0
  const trend = computeTrend(aggregate?.avgRecentPrice, aggregate?.avgPrevPrice)

  let investmentScore = 5
  if (trend.direction === "up") investmentScore += 2
  if (trend.direction === "down") investmentScore -= 1
  if (avgDaysOnMarket > 0 && avgDaysOnMarket <= 30) investmentScore += 1
  if (avgDaysOnMarket >= 90) investmentScore -= 1
  if (similarListings >= 25) investmentScore += 1
  investmentScore = Math.min(10, Math.max(1, investmentScore))

  const insights = [
    `Comparable inventory shows ${similarListings} active listings near this pricing band.`,
    avgDaysOnMarket
      ? `Average days on market is ${Math.round(avgDaysOnMarket)} days in this area.`
      : "Days-on-market data is limited for this neighborhood.",
    trend.direction === "up"
      ? "Recent pricing momentum indicates rising demand."
      : trend.direction === "down"
        ? "Pricing suggests a cooling market—negotiate accordingly."
        : "Pricing has remained stable across the past two quarters.",
  ]

  return {
    pricePerSqft: Math.round(derivedPricePerSqft),
    priceHistory: aggregate?.priceHistory?.length ? aggregate.priceHistory : [
      { date: new Date().toISOString(), price },
    ],
    marketTrend: trend.direction,
    daysOnMarket: Math.round(avgDaysOnMarket),
    similarListings,
    investmentScore,
    insights,
  }
}
