import { NextRequest, NextResponse } from "next/server"
import { getInventoryItems } from "@/lib/neon-client"

function parseNumeric(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseNumeric(searchParams.get("limit")) ?? 12
    const status = searchParams.get("status") || undefined
    const agencyId = searchParams.get("agencyId") || undefined

    const items = await getInventoryItems({ limit, status, agencyId })

    return NextResponse.json(
      {
        success: true,
        total: items.length,
        data: items,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Inventory API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 },
    )
  }
}
