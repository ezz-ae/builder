/**
 * GET /api/listings?agencyId=X&status=active&limit=12&featured=true
 * Returns listings from Neon database
 */

import { NextRequest, NextResponse } from "next/server"
import { getProperties, searchProperties } from "@/lib/neon-client"
import type { Property } from "@/lib/neon-client"

function parseNumericParam(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const agencyId = searchParams.get("agencyId") || "demo-agency"
    const statusParam = searchParams.get("status")
    const status =
      statusParam && ["active", "pending", "sold"].includes(statusParam)
        ? (statusParam as "active" | "pending" | "sold")
        : undefined
    const limit = Math.max(1, parseNumericParam(searchParams.get("limit")) ?? 12)
    const featured = searchParams.get("featured") === "true"
    const search = searchParams.get("search") || undefined
    const minPrice = parseNumericParam(searchParams.get("minPrice"))
    const maxPrice = parseNumericParam(searchParams.get("maxPrice"))
    const beds = parseNumericParam(searchParams.get("beds"))
    const baths = parseNumericParam(searchParams.get("baths"))

    // Query with filters
    const listings = await searchProperties({
      agencyId,
      status,
      featured,
      search,
      limit,
      minPrice,
      maxPrice,
      beds,
      baths,
    })

    return NextResponse.json(
      {
        success: true,
        data: listings,
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
