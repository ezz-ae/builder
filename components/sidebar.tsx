"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Copy, Upload, AlignLeft, AlignCenter, AlignRight, Lock, Unlock, RotateCw } from "lucide-react"
import type { CanvasElement, BackgroundConfig } from "./types"
import {
  FONT_OPTIONS,
  FONT_SIZES,
  FONT_WEIGHTS,
  GRADIENT_PRESETS,
  PATTERN_PRESETS,
  isTextElement,
  isShapeElement,
  isImageElement,
} from "./types"
import { LayersPanel } from "./layers-panel"
import { ExportPanel } from "./export-panel"
import type { RefObject } from "react"
import type { ProjectData } from "./types"

interface SidebarProps {
  selectedElement: CanvasElement | null
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
  onDeleteElement: (id: string) => void
  onDuplicateElement: (id: string) => void
  background: BackgroundConfig
  onUpdateBackground: (background: BackgroundConfig) => void
  elements: CanvasElement[]
  selectedElementId: string | null
  onSelectElement: (id: string) => void
  onToggleLock: (id: string) => void
  onBringForward: (id: string) => void
  onSendBackward: (id: string) => void
  canvasRef: RefObject<HTMLDivElement | null>
  onLoadProject: (data: ProjectData) => void
}

export function Sidebar({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  background,
  onUpdateBackground,
  elements,
  selectedElementId,
  onSelectElement,
  onToggleLock,
  onBringForward,
  onSendBackward,
  canvasRef,
  onLoadProject,
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageElementInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        onUpdateBackground({
          ...background,
          type: "image",
          imageUrl,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageElementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedElement && isImageElement(selectedElement)) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        onUpdateElement(selectedElement.id, { imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <aside className="w-80 border-l border-border bg-card overflow-y-auto">
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="background"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            Background
          </TabsTrigger>
          <TabsTrigger
            value="element"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            Element
          </TabsTrigger>
          <TabsTrigger
            value="layers"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            Layers
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="background" className="p-4 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Background Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["solid", "gradient", "image", "pattern"] as const).map((type) => (
                <Button
                  key={type}
                  variant={background.type === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdateBackground({ ...background, type })}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {background.type === "solid" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={background.color}
                  onChange={(e) => onUpdateBackground({ ...background, color: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={background.color}
                  onChange={(e) => onUpdateBackground({ ...background, color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {background.type === "gradient" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gradient Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => onUpdateBackground({ ...background, gradient: preset.value })}
                    className={`h-16 rounded-lg border-2 transition-all ${
                      background.gradient === preset.value
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    style={{ background: preset.value }}
                  >
                    <span className="sr-only">{preset.name}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Custom CSS Gradient</Label>
                <Input
                  value={background.gradient}
                  onChange={(e) => onUpdateBackground({ ...background, gradient: e.target.value })}
                  placeholder="linear-gradient(135deg, #000 0%, #333 100%)"
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {background.type === "image" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Upload Image</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button variant="outline" className="w-full bg-transparent" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
              {background.imageUrl && (
                <>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                    <img
                      src={background.imageUrl || "/placeholder.svg"}
                      alt="Background preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Image Position</Label>
                    <Select
                      value={background.imagePosition}
                      onValueChange={(value: "cover" | "contain" | "center") =>
                        onUpdateBackground({ ...background, imagePosition: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Blur: {background.imageBlur}px</Label>
                    <Slider
                      value={[background.imageBlur]}
                      onValueChange={([v]) => onUpdateBackground({ ...background, imageBlur: v })}
                      min={0}
                      max={20}
                      step={1}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {background.type === "pattern" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Pattern Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {PATTERN_PRESETS.map((preset) => (
                  <Button
                    key={preset.type}
                    variant={background.pattern.type === preset.type ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      onUpdateBackground({
                        ...background,
                        pattern: { ...background.pattern, type: preset.type },
                      })
                    }
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background.color}
                    onChange={(e) => onUpdateBackground({ ...background, color: e.target.value })}
                    className="h-10 w-14 cursor-pointer rounded border border-border"
                  />
                  <Input
                    value={background.color}
                    onChange={(e) => onUpdateBackground({ ...background, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pattern Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background.pattern.color}
                    onChange={(e) =>
                      onUpdateBackground({
                        ...background,
                        pattern: { ...background.pattern, color: e.target.value },
                      })
                    }
                    className="h-10 w-14 cursor-pointer rounded border border-border"
                  />
                  <Input
                    value={background.pattern.color}
                    onChange={(e) =>
                      onUpdateBackground({
                        ...background,
                        pattern: { ...background.pattern, color: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pattern Size: {background.pattern.size}px</Label>
                <Slider
                  value={[background.pattern.size]}
                  onValueChange={([v]) =>
                    onUpdateBackground({ ...background, pattern: { ...background.pattern, size: v } })
                  }
                  min={10}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Pattern Opacity: {Math.round(background.pattern.opacity * 100)}%
                </Label>
                <Slider
                  value={[background.pattern.opacity]}
                  onValueChange={([v]) =>
                    onUpdateBackground({ ...background, pattern: { ...background.pattern, opacity: v } })
                  }
                  min={0.05}
                  max={1}
                  step={0.05}
                />
              </div>
            </div>
          )}

          {/* Overlay section for all background types */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Color Overlay</Label>
              <Switch
                checked={background.overlay?.enabled || false}
                onCheckedChange={(checked) =>
                  onUpdateBackground({
                    ...background,
                    overlay: { ...background.overlay, enabled: checked },
                  })
                }
              />
            </div>
            {background.overlay?.enabled && (
              <>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background.overlay.color}
                    onChange={(e) =>
                      onUpdateBackground({
                        ...background,
                        overlay: { ...background.overlay, color: e.target.value },
                      })
                    }
                    className="h-10 w-14 cursor-pointer rounded border border-border"
                  />
                  <Input
                    value={background.overlay.color}
                    onChange={(e) =>
                      onUpdateBackground({
                        ...background,
                        overlay: { ...background.overlay, color: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Overlay Opacity: {Math.round(background.overlay.opacity * 100)}%
                  </Label>
                  <Slider
                    value={[background.overlay.opacity]}
                    onValueChange={([v]) =>
                      onUpdateBackground({
                        ...background,
                        overlay: { ...background.overlay, opacity: v },
                      })
                    }
                    min={0.1}
                    max={1}
                    step={0.1}
                  />
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="element" className="p-4 space-y-6">
          {selectedElement ? (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium capitalize">
                  {isTextElement(selectedElement)
                    ? selectedElement.type
                    : isShapeElement(selectedElement)
                      ? selectedElement.type.replace("-", " ")
                      : "Image"}{" "}
                  Element
                </Label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleLock(selectedElement.id)}
                    title={selectedElement.locked ? "Unlock" : "Lock"}
                  >
                    {selectedElement.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDuplicateElement(selectedElement.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteElement(selectedElement.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Text element specific controls */}
              {isTextElement(selectedElement) && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Content</Label>
                    <Input
                      value={selectedElement.content}
                      onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Font Family</Label>
                    <Select
                      value={selectedElement.fontFamily}
                      onValueChange={(value) => onUpdateElement(selectedElement.id, { fontFamily: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Font Size: {selectedElement.fontSize}px</Label>
                    <div className="flex flex-wrap gap-2">
                      {FONT_SIZES.map((size) => (
                        <Button
                          key={size.value}
                          variant={selectedElement.fontSize === size.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => onUpdateElement(selectedElement.id, { fontSize: size.value })}
                        >
                          {size.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Font Weight</Label>
                    <Select
                      value={selectedElement.fontWeight.toString()}
                      onValueChange={(value) =>
                        onUpdateElement(selectedElement.id, { fontWeight: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_WEIGHTS.map((weight) => (
                          <SelectItem key={weight.value} value={weight.value.toString()}>
                            {weight.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                        className="h-10 w-14 cursor-pointer rounded border border-border"
                      />
                      <Input
                        value={selectedElement.color}
                        onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Text Alignment</Label>
                    <div className="flex gap-2">
                      {[
                        { value: "left", icon: AlignLeft },
                        { value: "center", icon: AlignCenter },
                        { value: "right", icon: AlignRight },
                      ].map((align) => (
                        <Button
                          key={align.value}
                          variant={selectedElement.textAlign === align.value ? "default" : "outline"}
                          size="icon"
                          onClick={() =>
                            onUpdateElement(selectedElement.id, {
                              textAlign: align.value as "left" | "center" | "right",
                            })
                          }
                        >
                          <align.icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Rotation */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      <RotateCw className="inline h-4 w-4 mr-1" />
                      Rotation: {selectedElement.rotation || 0}°
                    </Label>
                    <Slider
                      value={[selectedElement.rotation || 0]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { rotation: v })}
                      min={-180}
                      max={180}
                      step={1}
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Letter Spacing: {selectedElement.letterSpacing || 0}px
                    </Label>
                    <Slider
                      value={[selectedElement.letterSpacing || 0]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { letterSpacing: v })}
                      min={-5}
                      max={20}
                      step={0.5}
                    />
                  </div>

                  {/* Line Height */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Line Height: {selectedElement.lineHeight?.toFixed(1) || "1.0"}
                    </Label>
                    <Slider
                      value={[selectedElement.lineHeight || 1]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { lineHeight: v })}
                      min={0.8}
                      max={3}
                      step={0.1}
                    />
                  </div>

                  {selectedElement.type !== "name" && selectedElement.type !== "custom" && (
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Show Icon</Label>
                      <Switch
                        checked={selectedElement.showIcon}
                        onCheckedChange={(checked) => onUpdateElement(selectedElement.id, { showIcon: checked })}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Background Badge</Label>
                      <Switch
                        checked={selectedElement.showBackground}
                        onCheckedChange={(checked) => onUpdateElement(selectedElement.id, { showBackground: checked })}
                      />
                    </div>
                    {selectedElement.showBackground && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            selectedElement.backgroundColor.startsWith("rgba")
                              ? "#000000"
                              : selectedElement.backgroundColor
                          }
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              backgroundColor: e.target.value,
                            })
                          }
                          className="h-10 w-14 cursor-pointer rounded border border-border"
                        />
                        <Input
                          value={selectedElement.backgroundColor}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              backgroundColor: e.target.value,
                            })
                          }
                          className="flex-1"
                          placeholder="rgba(0,0,0,0.5)"
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Effects Section */}
                  <div className="space-y-3 border-t border-border pt-4">
                    <Label className="text-sm font-medium">Text Effects</Label>

                    {/* Shadow */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Drop Shadow</Label>
                        <Switch
                          checked={selectedElement.effects?.shadow?.enabled || false}
                          onCheckedChange={(checked) =>
                            onUpdateElement(selectedElement.id, {
                              effects: {
                                ...selectedElement.effects,
                                shadow: { ...selectedElement.effects?.shadow, enabled: checked },
                              },
                            })
                          }
                        />
                      </div>
                      {selectedElement.effects?.shadow?.enabled && (
                        <div className="space-y-2 pl-2 border-l-2 border-border">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Offset X</Label>
                              <Slider
                                value={[selectedElement.effects.shadow.offsetX]}
                                onValueChange={([v]) =>
                                  onUpdateElement(selectedElement.id, {
                                    effects: {
                                      ...selectedElement.effects,
                                      shadow: { ...selectedElement.effects.shadow, offsetX: v },
                                    },
                                  })
                                }
                                min={-20}
                                max={20}
                                step={1}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Offset Y</Label>
                              <Slider
                                value={[selectedElement.effects.shadow.offsetY]}
                                onValueChange={([v]) =>
                                  onUpdateElement(selectedElement.id, {
                                    effects: {
                                      ...selectedElement.effects,
                                      shadow: { ...selectedElement.effects.shadow, offsetY: v },
                                    },
                                  })
                                }
                                min={-20}
                                max={20}
                                step={1}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Blur: {selectedElement.effects.shadow.blur}px</Label>
                            <Slider
                              value={[selectedElement.effects.shadow.blur]}
                              onValueChange={([v]) =>
                                onUpdateElement(selectedElement.id, {
                                  effects: {
                                    ...selectedElement.effects,
                                    shadow: { ...selectedElement.effects.shadow, blur: v },
                                  },
                                })
                              }
                              min={0}
                              max={30}
                              step={1}
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={
                                selectedElement.effects.shadow.color.startsWith("rgba")
                                  ? "#000000"
                                  : selectedElement.effects.shadow.color
                              }
                              onChange={(e) =>
                                onUpdateElement(selectedElement.id, {
                                  effects: {
                                    ...selectedElement.effects,
                                    shadow: { ...selectedElement.effects.shadow, color: e.target.value },
                                  },
                                })
                              }
                              className="h-8 w-10 cursor-pointer rounded border border-border"
                            />
                            <Input
                              value={selectedElement.effects.shadow.color}
                              onChange={(e) =>
                                onUpdateElement(selectedElement.id, {
                                  effects: {
                                    ...selectedElement.effects,
                                    shadow: { ...selectedElement.effects.shadow, color: e.target.value },
                                  },
                                })
                              }
                              className="flex-1 h-8 text-xs"
                              placeholder="rgba(0,0,0,0.5)"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Outline */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Text Outline</Label>
                        <Switch
                          checked={selectedElement.effects?.outline?.enabled || false}
                          onCheckedChange={(checked) =>
                            onUpdateElement(selectedElement.id, {
                              effects: {
                                ...selectedElement.effects,
                                outline: { ...selectedElement.effects?.outline, enabled: checked },
                              },
                            })
                          }
                        />
                      </div>
                      {selectedElement.effects?.outline?.enabled && (
                        <div className="space-y-2 pl-2 border-l-2 border-border">
                          <div>
                            <Label className="text-xs">Width: {selectedElement.effects.outline.width}px</Label>
                            <Slider
                              value={[selectedElement.effects.outline.width]}
                              onValueChange={([v]) =>
                                onUpdateElement(selectedElement.id, {
                                  effects: {
                                    ...selectedElement.effects,
                                    outline: { ...selectedElement.effects.outline, width: v },
                                  },
                                })
                              }
                              min={1}
                              max={10}
                              step={1}
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={selectedElement.effects.outline.color}
                              onChange={(e) =>
                                onUpdateElement(selectedElement.id, {
                                  effects: {
                                    ...selectedElement.effects,
                                    outline: { ...selectedElement.effects.outline, color: e.target.value },
                                  },
                                })
                              }
                              className="h-8 w-10 cursor-pointer rounded border border-border"
                            />
                            <Input
                              value={selectedElement.effects.outline.color}
                              onChange={(e) =>
                                onUpdateElement(selectedElement.id, {
                                  effects: {
                                    ...selectedElement.effects,
                                    outline: { ...selectedElement.effects.outline, color: e.target.value },
                                  },
                                })
                              }
                              className="flex-1 h-8 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Shape element specific controls */}
              {isShapeElement(selectedElement) && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Fill Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElement.fill}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="h-10 w-14 cursor-pointer rounded border border-border"
                      />
                      <Input
                        value={selectedElement.fill}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Stroke Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElement.stroke}
                        onChange={(e) => onUpdateElement(selectedElement.id, { stroke: e.target.value })}
                        className="h-10 w-14 cursor-pointer rounded border border-border"
                      />
                      <Input
                        value={selectedElement.stroke}
                        onChange={(e) => onUpdateElement(selectedElement.id, { stroke: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Stroke Width: {selectedElement.strokeWidth}px</Label>
                    <Slider
                      value={[selectedElement.strokeWidth]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { strokeWidth: v })}
                      min={0}
                      max={20}
                      step={1}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Opacity: {Math.round(selectedElement.opacity * 100)}%</Label>
                    <Slider
                      value={[selectedElement.opacity]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { opacity: v })}
                      min={0.1}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  {selectedElement.type === "rectangle" && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Border Radius: {selectedElement.borderRadius || 0}px
                      </Label>
                      <Slider
                        value={[selectedElement.borderRadius || 0]}
                        onValueChange={([v]) => onUpdateElement(selectedElement.id, { borderRadius: v })}
                        min={0}
                        max={50}
                        step={1}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Rotation: {selectedElement.rotation}°</Label>
                    <Slider
                      value={[selectedElement.rotation]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { rotation: v })}
                      min={-180}
                      max={180}
                      step={1}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Width</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.width)}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              width: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Height</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.height)}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              height: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Image element specific controls */}
              {isImageElement(selectedElement) && (
                <>
                  <input
                    ref={imageElementInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageElementUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => imageElementInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>

                  {selectedElement.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                      <img
                        src={selectedElement.imageUrl || "/placeholder.svg"}
                        alt="Element preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Object Fit</Label>
                    <Select
                      value={selectedElement.objectFit}
                      onValueChange={(value: "cover" | "contain" | "fill") =>
                        onUpdateElement(selectedElement.id, { objectFit: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Opacity: {Math.round(selectedElement.opacity * 100)}%</Label>
                    <Slider
                      value={[selectedElement.opacity]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { opacity: v })}
                      min={0.1}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Border Radius: {selectedElement.borderRadius}px</Label>
                    <Slider
                      value={[selectedElement.borderRadius]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { borderRadius: v })}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Rotation: {selectedElement.rotation}°</Label>
                    <Slider
                      value={[selectedElement.rotation]}
                      onValueChange={([v]) => onUpdateElement(selectedElement.id, { rotation: v })}
                      min={-180}
                      max={180}
                      step={1}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Width</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.width)}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              width: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Height</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.height)}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              height: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Position controls for all elements */}
              <div className="space-y-3 border-t border-border pt-4">
                <Label className="text-sm font-medium">Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedElement.position.x)}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          position: {
                            ...selectedElement.position,
                            x: Number.parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedElement.position.y)}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          position: {
                            ...selectedElement.position,
                            y: Number.parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center text-center text-muted-foreground">
              <p>Select an element to edit its properties</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="layers" className="p-4">
          <LayersPanel
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={onSelectElement}
            onDeleteElement={onDeleteElement}
            onToggleLock={onToggleLock}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
          />
        </TabsContent>

        <TabsContent value="export" className="p-4">
          <ExportPanel
            canvasRef={canvasRef}
            elements={elements}
            background={background}
            onLoadProject={onLoadProject}
          />
        </TabsContent>
      </Tabs>
    </aside>
  )
}
