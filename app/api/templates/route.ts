import { NextResponse } from "next/server"
import { ALL_WEBSITE_TEMPLATES, WEBSITE_TEMPLATES_COUNT } from "@/components/templates/website-templates"

export async function GET() {
  const uniqueCategories = Array.from(
    new Set(ALL_WEBSITE_TEMPLATES.map((template) => template.category ?? "general")),
  )

  return NextResponse.json(
    {
      success: true,
      data: {
        templates: ALL_WEBSITE_TEMPLATES,
        categories: uniqueCategories,
        total: WEBSITE_TEMPLATES_COUNT,
      },
    },
    { status: 200 },
  )
}
