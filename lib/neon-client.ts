/**
 * Neon Database Client
 * Handles all real estate data fetching and updates
 */

// Mock data for demo - replace with actual Neon queries in production
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

/**
 * Mock Properties - Replace with Neon query
 * SELECT * FROM properties WHERE agency_id = ?
 */
export async function getProperties(agencyId: string): Promise<Property[]> {
  // TODO: Replace with actual Neon query
  // const result = await db.query('SELECT * FROM properties WHERE agency_id = $1', [agencyId]);
  // return result.rows;

  return [
    {
      id: "prop-1",
      agencyId,
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
      agencyId,
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
      agencyId,
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
}

/**
 * Mock Single Property - Replace with Neon query
 * SELECT * FROM properties WHERE id = ? AND agency_id = ?
 */
export async function getProperty(propertyId: string, agencyId: string): Promise<Property | null> {
  // TODO: Replace with actual Neon query
  const properties = await getProperties(agencyId)
  return properties.find((p) => p.id === propertyId) || null
}

/**
 * Mock Agents - Replace with Neon query
 * SELECT * FROM agents WHERE agency_id = ?
 */
export async function getAgents(agencyId: string): Promise<Agent[]> {
  // TODO: Replace with actual Neon query
  return [
    {
      id: "agent-1",
      agencyId,
      name: "Sarah Johnson",
      title: "Senior Real Estate Agent",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "With over 10 years of experience, Sarah specializes in luxury homes.",
      license: "CA-RE-12345",
      specialties: ["Luxury Homes", "Victorian Properties", "Investment Properties"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "agent-2",
      agencyId,
      name: "Michael Chen",
      title: "Real Estate Agent",
      email: "michael@example.com",
      phone: "(555) 234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Michael helps first-time home buyers find their dream homes.",
      license: "CA-RE-12346",
      specialties: ["First-Time Buyers", "Starter Homes"],
      createdAt: new Date().toISOString(),
    },
  ]
}

/**
 * Mock Single Agent - Replace with Neon query
 * SELECT * FROM agents WHERE id = ? AND agency_id = ?
 */
export async function getAgent(agentId: string, agencyId: string): Promise<Agent | null> {
  // TODO: Replace with actual Neon query
  const agents = await getAgents(agencyId)
  return agents.find((a) => a.id === agentId) || null
}

/**
 * Mock Agency - Replace with Neon query
 * SELECT * FROM agencies WHERE id = ?
 */
export async function getAgency(agencyId: string): Promise<Agency | null> {
  // TODO: Replace with actual Neon query
  return {
    id: agencyId,
    name: "Premier Real Estate",
    email: "info@premierrealestate.com",
    phone: "(555) 100-1234",
    address: "100 Main Street, San Francisco, CA 94105",
    logoUrl: "https://via.placeholder.com/200x60?text=Premier+RE",
    website: "https://premierrealestate.com",
    description: "San Francisco's leading real estate agency since 2010",
    createdAt: new Date().toISOString(),
  }
}

/**
 * Mock Website - Replace with Neon query
 * SELECT * FROM websites WHERE id = ?
 */
export async function getWebsite(websiteId: string): Promise<Website | null> {
  // TODO: Replace with actual Neon query
  return {
    id: websiteId,
    agencyId: "demo-agency",
    name: "Premier Real Estate Website",
    slug: "premier-real-estate",
    configJson: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Update Website - Replace with Neon query
 * UPDATE websites SET config_json = ?, updated_at = ? WHERE id = ?
 */
export async function updateWebsite(
  websiteId: string,
  config: Record<string, unknown>,
): Promise<Website | null> {
  // TODO: Replace with actual Neon query
  return {
    id: websiteId,
    agencyId: "demo-agency",
    name: "Premier Real Estate Website",
    slug: "premier-real-estate",
    configJson: config,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Search Properties - Replace with Neon query
 * SELECT * FROM properties WHERE agency_id = ? AND (
 *   address LIKE ? OR price BETWEEN ? AND ? OR beds = ? OR status = ?
 * )
 */
export interface PropertyFilter {
  agencyId: string
  search?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  status?: "active" | "pending" | "sold"
  featured?: boolean
}

export async function searchProperties(filters: PropertyFilter): Promise<Property[]> {
  // TODO: Replace with actual Neon query with proper parameterized queries
  let properties = await getProperties(filters.agencyId)

  if (filters.search) {
    const query = filters.search.toLowerCase()
    properties = properties.filter((p) => p.address.toLowerCase().includes(query))
  }

  if (filters.minPrice !== undefined) {
    properties = properties.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    properties = properties.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.beds !== undefined) {
    properties = properties.filter((p) => p.beds === filters.beds)
  }

  if (filters.status) {
    properties = properties.filter((p) => p.status === filters.status)
  }

  if (filters.featured) {
    properties = properties.filter((p) => p.featured)
  }

  return properties
}

/**
 * Agent Listings - Get properties for a specific agent
 * SELECT * FROM properties WHERE agency_id = ? AND agent_id = ?
 */
export async function getAgentProperties(agentId: string, agencyId: string): Promise<Property[]> {
  // TODO: Replace with actual Neon query
  const properties = await getProperties(agencyId)
  return properties.filter((p) => p.agentId === agentId)
}

/**
 * Agency Statistics
 * Useful for dashboard and info blocks
 */
export interface AgencyStats {
  totalProperties: number
  activeListings: number
  soldLastMonth: number
  totalAgents: number
  averagePrice: number
}

export async function getAgencyStats(agencyId: string): Promise<AgencyStats> {
  // TODO: Replace with actual Neon query using aggregation functions
  const properties = await getProperties(agencyId)
  const agents = await getAgents(agencyId)

  const activeProperties = properties.filter((p) => p.status === "active")
  const soldLastMonth = properties.filter(
    (p) =>
      p.status === "sold" &&
      new Date(p.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).length

  return {
    totalProperties: properties.length,
    activeListings: activeProperties.length,
    soldLastMonth,
    totalAgents: agents.length,
    averagePrice: activeProperties.length > 0 ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length : 0,
  }
}
