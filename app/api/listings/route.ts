/**
 * GET /api/listings?agencyId=X&status=active&limit=12&featured=true
 * Returns listings from Neon database
 */

import { NextRequest, NextResponse } from "next/server"
import { getProperties, searchProperties } from "@/lib/neon-client"
import type { Property } from "@/lib/neon-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const agencyId = searchParams.get("agencyId") || "demo-agency"
    const status = (searchParams.get("status") as "active" | "pending" | "sold") || "active"
    const limit = parseInt(searchParams.get("limit") || "12", 10)
    const featured = searchParams.get("featured") === "true"
    const search = searchParams.get("search") || undefined

    // Query with filters
    const listings = await searchProperties({
      agencyId,
      status,
      featured,
      search,
    })

    // Slice to limit
    const limited = listings.slice(0, limit)

    return NextResponse.json(
      {
        success: true,
        data: limited,
        total: listings.length,
        limit,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings" },
      { status: 500 },
    )
  }
}
