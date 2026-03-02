/**
 * GET /api/agents?agencyId=X
 * Returns agents from Neon database
 */

import { NextRequest, NextResponse } from "next/server"
import { getAgents } from "@/lib/neon-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agencyId = searchParams.get("agencyId") || "demo-agency"

    const agents = await getAgents(agencyId)

    return NextResponse.json(
      {
        success: true,
        data: agents,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 },
    )
  }
}
