import { NextRequest, NextResponse } from "next/server"
import { generateMarketingCampaign, generatePropertyDescription } from "@/lib/vertex/gemini"
import { getProperty } from "@/lib/neon-client"

const HAS_VERTEX_KEY = Boolean(process.env.GOOGLE_API_KEY)

type ChatRequest = {
  agencyId?: string
  agencyName?: string
  propertyId?: string
  propertyAddress?: string
  price?: number
  beds?: number
  baths?: number
  sqft?: number
  description?: string
  targetAudience?: string
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function fallbackCampaign(input: ChatRequest & { description: string; price: number; beds: number; baths: number }) {
  const { propertyAddress, price, beds, baths, agencyName } = input
  return {
    adHeadline: `${agencyName ?? "Your Agency"} - Move-in ready at ${propertyAddress}`,
    adCopy: `Step inside this ${beds}-bed, ${baths}-bath property near ${propertyAddress}. Priced at $${Math.round(
      price,
    ).toLocaleString()}, it's ready for your next chapter.`,
    ctaText: "Schedule a Tour",
    keywordSuggestions: ["real estate", "homes for sale", "luxury listings", "property near me", "real estate agency"],
    audienceSuggestions: [
      "Move-up buyers",
      "Empty nesters",
      "Luxury seekers",
      "City professionals",
      "Investor buyers",
    ],
    platforms: ["Google Ads", "Instagram", "Facebook"],
    estimatedReach: "3,500 local impressions / month",
    emailSequence: [
      { day: 1, subject: `Thanks for your interest in ${propertyAddress}`, body: "We'll reach out soon to schedule a tour." },
      { day: 3, subject: "Still curious about the property?", body: "Here's a video tour link and updated availability." },
      { day: 7, subject: "Let us help you make an offer", body: "Our agents are ready to walk you through next steps." },
    ],
    socialMediaCaptions: [
      { platform: "Instagram", caption: `Live where every detail feels custom. Explore ${propertyAddress} today.` },
      { platform: "Facebook", caption: `🔑 Fresh on the market: ${propertyAddress} — ${beds} beds, ${baths} baths, $${Math.round(price).toLocaleString()}!` },
      { platform: "LinkedIn", caption: `${agencyName ?? "Our team"} just listed ${propertyAddress}. Ready for move-in.` },
    ],
  }
}

function fallbackDescription(address: string, price: number, beds: number, baths: number) {
  return {
    seoTitle: `Explore ${beds}-bed home at ${address}`,
    metaDescription: `Discover ${address} — ${beds} beds, ${baths} baths, priced at $${Math.round(price).toLocaleString()} with premium finishes.`,
    longDescription: `Step into ${address}, ${beds}-bedroom, ${baths}-bathroom living with thoughtful design and a price tag of $${Math.round(
      price,
    ).toLocaleString()}. The updated kitchen, bright living room, and outdoor space make it perfect for entertaining while staying close to city amenities.`,
    keywords: ["real estate", "home for sale", "luxury home", "property listing"],
  }
}

async function safeGenerateMarketingCampaign(input: Parameters<typeof generateMarketingCampaign>[0]) {
  if (!HAS_VERTEX_KEY) {
    return fallbackCampaign(input)
  }

  try {
    return await generateMarketingCampaign(input)
  } catch (error) {
    console.error("Vertex campaign error:", error)
    return fallbackCampaign(input)
  }
}

async function safeGenerateDescription(address: string, price: number, beds: number, baths: number, description: string) {
  if (!HAS_VERTEX_KEY) {
    return fallbackDescription(address, price, beds, baths)
  }

  try {
    return await generatePropertyDescription(address, price, beds, baths, description)
  } catch (error) {
    console.error("Vertex description error:", error)
    return fallbackDescription(address, price, beds, baths)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ChatRequest
    const agencyId = payload.agencyId ?? "demo-agency"
    const propertyRecord = payload.propertyId ? await getProperty(payload.propertyId, agencyId) : null

    const address = propertyRecord?.address ?? payload.propertyAddress
    const price = propertyRecord?.price ?? toNumber(payload.price)
    const beds = propertyRecord?.beds ?? toNumber(payload.beds)
    const baths = propertyRecord?.baths ?? toNumber(payload.baths)
    const sqft = propertyRecord?.sqft ?? toNumber(payload.sqft)
    const description = propertyRecord?.description ?? payload.description ?? ""
    const agencyName = payload.agencyName ?? propertyRecord?.agencyId ?? "Real Estate Experts"
    const targetAudience = payload.targetAudience

    if (!address || price <= 0) {
      return NextResponse.json(
        { success: false, error: "Please provide a property address and a valid price to generate a campaign." },
        { status: 400 },
      )
    }

    const campaign = await safeGenerateMarketingCampaign({
      propertyAddress: address,
      price,
      beds,
      baths,
      sqft,
      description,
      agencyName,
      targetAudience,
    })

    const seoCopy = await safeGenerateDescription(address, price, beds, baths, description)

    return NextResponse.json(
      {
        success: true,
        data: {
          campaign,
          seoCopy,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("AI chat handler error:", error)
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to generate AI content" },
      { status: 500 },
    )
  }
}
