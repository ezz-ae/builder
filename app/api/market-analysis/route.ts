import { NextRequest, NextResponse } from "next/server"
import { getMarketInsights, getMarketListingAnalysis } from "@/lib/neon-client"

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const priceParam = searchParams.get("price")
    const price = priceParam ? Number(priceParam) : undefined

    if (!address) {
      return NextResponse.json(
        { success: false, error: "address is required" },
        { status: 400 },
      )
    }

    const [marketInsights, listingAnalysis] = await Promise.all([
      getMarketInsights(address),
      price && Number.isFinite(price) ? getMarketListingAnalysis(address, price) : Promise.resolve(null),
    ])

    const metrics = [
      {
        label: "Average Price",
        value: formatPrice(marketInsights.averagePrice),
        trend: marketInsights.marketTrend,
      },
      {
        label: "Price Range",
        value: `${formatPrice(marketInsights.priceRange.min)} - ${formatPrice(marketInsights.priceRange.max)}`,
      },
      {
        label: "Avg Days on Market",
        value: `${marketInsights.averageDaysOnMarket} days`,
      },
      {
        label: "Walkscore",
        value: marketInsights.walkscore ? `${marketInsights.walkscore}` : "—",
      },
    ]

    if (listingAnalysis) {
      metrics.push({
        label: "Price / Sqft",
        value: formatPrice(listingAnalysis.pricePerSqft),
      })
      if (listingAnalysis.investmentScore) {
        metrics.push({
          label: "Investment Score",
          value: `${listingAnalysis.investmentScore}/10`,
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          marketInsights,
          listingAnalysis,
          marketMetrics: metrics,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Market analysis error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch market analysis" },
      { status: 500 },
    )
  }
}
