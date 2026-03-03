import { Client } from "@neondatabase/serverless"

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
