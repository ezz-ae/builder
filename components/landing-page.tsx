"use client"

import { ArrowRight, ImageIcon, Type, Download, Layers, Palette, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: ImageIcon,
      title: "Custom Backgrounds",
      description: "Upload images, choose gradients, or use pattern backgrounds",
    },
    {
      icon: Type,
      title: "Rich Typography",
      description: "Multiple fonts, sizes, shadows, and text effects",
    },
    {
      icon: Layers,
      title: "Drag & Drop",
      description: "Position elements anywhere with intuitive controls",
    },
    {
      icon: Palette,
      title: "Shapes & Icons",
      description: "Add rectangles, circles, dividers, and social icons",
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Download as PNG, JPEG, or WebP in multiple resolutions",
    },
    {
      icon: Share2,
      title: "Share & Save",
      description: "Generate shareable links or save projects locally",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">OG Image Generator</span>
          </div>
          <Button onClick={onGetStarted} size="sm">
            Open Editor
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col">
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Create stunning OG images in seconds
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Design beautiful social media preview images with custom backgrounds, typography, and shapes. No design
              skills required.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button onClick={onGetStarted} size="lg" className="gap-2">
                Start Creating
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Preview mockup */}
        <section className="container mx-auto px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-xl border border-border/60 bg-card shadow-2xl overflow-hidden">
              <div className="aspect-[1200/630] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative flex items-center justify-center">
                {/* Simulated OG image preview */}
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>
                <div className="relative z-10 text-center space-y-4 px-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Preview
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Your Amazing Title</h2>
                  <p className="text-white/60 text-lg">yourdomain.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/40 bg-muted/20">
          <div className="container mx-auto px-6 py-16">
            <h2 className="text-2xl font-semibold text-center mb-12">Everything you need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border border-border/40 bg-card hover:border-border/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Ready to create?</h2>
            <p className="text-muted-foreground">
              Start with a template or build from scratch. Your OG image is just a few clicks away.
            </p>
            <Button onClick={onGetStarted} size="lg" className="gap-2">
              Open Editor
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          Built for creating beautiful social media previews
        </div>
      </footer>
    </div>
  )
}
