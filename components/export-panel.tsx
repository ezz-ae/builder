"use client"

import { useState } from "react"
import type { RefObject } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, Copy, Share2, Save, FolderOpen, Check, Loader2 } from "lucide-react"
import type { CanvasElement, BackgroundConfig, ProjectData } from "./types"

interface ExportPanelProps {
  canvasRef: RefObject<HTMLDivElement | null>
  elements: CanvasElement[]
  background: BackgroundConfig
  onLoadProject: (data: ProjectData) => void
}

function compressToBase64(str: string): string {
  try {
    // Use encodeURIComponent to handle unicode, then btoa
    return btoa(unescape(encodeURIComponent(str)))
  } catch {
    return btoa(str)
  }
}

function decompressFromBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)))
  } catch {
    return atob(str)
  }
}

function minifyProjectData(data: ProjectData): object {
  const minified = {
    v: data.version,
    e: data.elements.map((el) => {
      const minEl: Record<string, unknown> = {
        i: el.id,
        t: el.type,
        p: [Math.round(el.position.x), Math.round(el.position.y)],
        z: el.zIndex,
      }

      if ("content" in el) {
        minEl.c = el.content
        if (el.fontFamily !== "Geist, sans-serif") minEl.ff = el.fontFamily
        if (el.fontSize !== 24) minEl.fs = el.fontSize
        if (el.fontWeight !== 400) minEl.fw = el.fontWeight
        if (el.color !== "#ffffff") minEl.co = el.color
        if (el.showBackground) minEl.sb = 1
        if (el.backgroundColor !== "rgba(0,0,0,0.5)") minEl.bg = el.backgroundColor
        if (el.textAlign !== "left") minEl.ta = el.textAlign
        if (!el.showIcon) minEl.si = 0
        if (el.rotation) minEl.r = el.rotation
        if (el.letterSpacing) minEl.ls = el.letterSpacing
        if (el.lineHeight !== 1) minEl.lh = el.lineHeight
        if (el.locked) minEl.l = 1
        if (el.effects?.shadow?.enabled) minEl.es = el.effects.shadow
        if (el.effects?.outline?.enabled) minEl.eo = el.effects.outline
      } else if ("width" in el && "imageUrl" in el) {
        minEl.w = el.width
        minEl.h = el.height
        minEl.u = el.imageUrl
        if (el.opacity !== 1) minEl.o = el.opacity
        if (el.rotation) minEl.r = el.rotation
        if (el.borderRadius) minEl.br = el.borderRadius
      } else if ("width" in el) {
        minEl.w = el.width
        minEl.h = el.height
        if (el.fill && el.fill !== "transparent") minEl.f = el.fill
        if (el.stroke) minEl.s = el.stroke
        if (el.strokeWidth) minEl.sw = el.strokeWidth
        if (el.opacity !== 1) minEl.o = el.opacity
        if (el.rotation) minEl.r = el.rotation
        if ("borderRadius" in el && el.borderRadius) minEl.br = el.borderRadius
      }

      return minEl
    }),
    b: {
      t: data.background.type,
      ...(data.background.type === "solid" && { c: data.background.color }),
      ...(data.background.type === "gradient" && { g: data.background.gradient }),
      ...(data.background.type === "image" && { u: data.background.imageUrl }),
      ...(data.background.type === "pattern" && {
        pt: data.background.pattern?.type,
        pc: data.background.pattern?.color,
        ps: data.background.pattern?.size,
        po: data.background.pattern?.opacity,
        pb: data.background.pattern?.backgroundColor,
      }),
      ...(data.background.blur && { bl: data.background.blur }),
      ...(data.background.overlay && { ov: data.background.overlay }),
    },
  }
  return minified
}

function expandProjectData(minified: Record<string, unknown>): ProjectData {
  const min = minified as {
    v: string
    e: Array<Record<string, unknown>>
    b: Record<string, unknown>
  }

  return {
    version: min.v as string,
    name: "Shared Project",
    elements: min.e.map((el) => {
      const pos = el.p as [number, number]
      const base = {
        id: el.i as string,
        type: el.t as string,
        position: { x: pos[0], y: pos[1] },
        zIndex: el.z as number,
        locked: el.l === 1,
        rotation: (el.r as number) || 0,
      }

      if (el.c !== undefined) {
        // Text element
        return {
          ...base,
          content: el.c as string,
          fontFamily: (el.ff as string) || "Geist, sans-serif",
          fontSize: (el.fs as number) || 24,
          fontWeight: (el.fw as number) || 400,
          color: (el.co as string) || "#ffffff",
          backgroundColor: (el.bg as string) || "rgba(0,0,0,0.5)",
          showBackground: el.sb === 1,
          textAlign: (el.ta as string) || "left",
          showIcon: el.si !== 0,
          letterSpacing: (el.ls as number) || 0,
          lineHeight: (el.lh as number) || 1,
          effects: {
            shadow: el.es || { enabled: false, offsetX: 2, offsetY: 2, blur: 4, color: "rgba(0,0,0,0.5)" },
            outline: el.eo || { enabled: false, width: 2, color: "#000000" },
          },
        }
      } else if (el.u !== undefined && el.w !== undefined) {
        // Image element
        return {
          ...base,
          width: el.w as number,
          height: el.h as number,
          imageUrl: el.u as string,
          opacity: (el.o as number) || 1,
          borderRadius: (el.br as number) || 0,
          objectFit: "cover",
        }
      } else {
        // Shape element
        return {
          ...base,
          width: el.w as number,
          height: el.h as number,
          fill: (el.f as string) || "transparent",
          stroke: (el.s as string) || "#ffffff",
          strokeWidth: (el.sw as number) || 0,
          opacity: (el.o as number) || 1,
          borderRadius: (el.br as number) || 0,
        }
      }
    }) as CanvasElement[],
    background: {
      type: min.b.t as BackgroundConfig["type"],
      color: (min.b.c as string) || "#1a1a2e",
      gradient: (min.b.g as string) || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      imageUrl: min.b.u as string,
      pattern: min.b.pt
        ? {
            type: min.b.pt as "dots" | "grid" | "waves" | "diagonal" | "cross",
            color: (min.b.pc as string) || "#ffffff",
            size: (min.b.ps as number) || 20,
            opacity: (min.b.po as number) || 0.1,
            backgroundColor: (min.b.pb as string) || "#1a1a2e",
          }
        : undefined,
      blur: min.b.bl as number,
      overlay: min.b.ov as { color: string; opacity: number },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function ExportPanel({ canvasRef, elements, background, onLoadProject }: ExportPanelProps) {
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png")
  const [scale, setScale] = useState(2)
  const [quality, setQuality] = useState(90)
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  const handleExport = async () => {
    if (!canvasRef.current) {
      alert("Canvas not found. Please try again.")
      return
    }

    setIsExporting(true)

    try {
      const html2canvas = (await import("html2canvas-pro")).default

      const canvasElement = canvasRef.current

      const canvas = await html2canvas(canvasElement, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 1200,
        height: 630,
        onclone: (_clonedDoc: Document, element: HTMLElement) => {
          element.style.transform = "none"
          element.style.width = "1200px"
          element.style.height = "630px"
        },
      })

      const mimeType = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp"
      const qualityValue = format === "png" ? undefined : quality / 100

      const dataUrl = canvas.toDataURL(mimeType, qualityValue)
      const link = document.createElement("a")
      link.download = `og-image-${Date.now()}.${format}`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Export failed:", err)
      alert("Failed to export image. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!canvasRef.current) {
      alert("Canvas not found. Please try again.")
      return
    }

    setIsCopying(true)

    try {
      const html2canvas = (await import("html2canvas-pro")).default

      const canvas = await html2canvas(canvasRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 1200,
        height: 630,
        onclone: (_clonedDoc: Document, element: HTMLElement) => {
          element.style.transform = "none"
          element.style.width = "1200px"
          element.style.height = "630px"
        },
      })

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/png")
      })

      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        throw new Error("Failed to create image blob")
      }
    } catch (err) {
      console.error("Copy to clipboard failed:", err)
      alert("Failed to copy to clipboard. Your browser may not support this feature. Please use Download instead.")
    } finally {
      setIsCopying(false)
    }
  }

  const handleSaveProject = () => {
    const projectData: ProjectData = {
      version: "1.0.0",
      name: "OG Image Project",
      elements,
      background,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.download = "og-image-project.json"
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const handleLoadProject = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string) as ProjectData
            onLoadProject(data)
          } catch (err) {
            console.error("Failed to load project:", err)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleShareLink = async () => {
    const projectData: ProjectData = {
      version: "1.0.0",
      name: "OG Image Project",
      elements,
      background,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const hasImages = elements.some((el) => "imageUrl" in el && el.imageUrl)
    const hasBackgroundImage = background.type === "image" && background.imageUrl

    if (hasImages || hasBackgroundImage) {
      const proceed = confirm(
        "Your project contains images which may make the share URL very long or exceed browser limits. " +
          "Consider using 'Save' to export the project file instead. Continue anyway?",
      )
      if (!proceed) return
    }

    try {
      const minified = minifyProjectData(projectData)
      const encoded = compressToBase64(JSON.stringify(minified))
      const url = `${window.location.origin}${window.location.pathname}?p=${encoded}`

      if (url.length > 8000) {
        alert("Project is too large to share via URL. Please use 'Save' to export as a file instead.")
        return
      }

      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to generate share link:", err)
      alert("Failed to generate share link. Please try saving the project as a file instead.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Format</Label>
        <Select value={format} onValueChange={(v) => setFormat(v as "png" | "jpeg" | "webp")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG (Lossless)</SelectItem>
            <SelectItem value="jpeg">JPEG (Smaller size)</SelectItem>
            <SelectItem value="webp">WebP (Modern)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Scale: {scale}x</Label>
        <Slider value={[scale]} onValueChange={([v]) => setScale(v)} min={1} max={3} step={1} />
        <p className="text-xs text-muted-foreground">
          Output: {1200 * scale} x {630 * scale}px
        </p>
      </div>

      {format !== "png" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quality: {quality}%</Label>
          <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={5} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleExport} className="w-full" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyToClipboard}
          className="w-full bg-transparent"
          disabled={isCopying}
        >
          {isCopying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Copying...
            </>
          ) : copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <Label className="text-sm font-medium">Project</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveProject} className="w-full bg-transparent">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadProject} className="w-full bg-transparent">
            <FolderOpen className="mr-2 h-4 w-4" />
            Load
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleShareLink} className="w-full bg-transparent">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Link Copied!
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Copy Share Link
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">Note: Share links work best for projects without images</p>
      </div>
    </div>
  )
}

export { expandProjectData, decompressFromBase64 }
