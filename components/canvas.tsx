"use client"

import type React from "react"

import { forwardRef, useState, useCallback, useRef, useEffect } from "react"
import type { CanvasElement, BackgroundConfig } from "./types"
import { isTextElement, isShapeElement, isImageElement } from "./types"
import { DraggableElement } from "./draggable-element"
import { ShapeElement } from "./shape-element"
import { ImageElement } from "./image-element"
import { PatternBackground } from "./pattern-background"

interface CanvasProps {
  elements: CanvasElement[]
  background: BackgroundConfig
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
  showGrid: boolean
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 630

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ elements, background, selectedElementId, onSelectElement, onUpdateElement, showGrid }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    useEffect(() => {
      const updateScale = () => {
        if (containerRef.current) {
          const container = containerRef.current.parentElement
          if (container) {
            const availableWidth = container.clientWidth - 64
            const availableHeight = container.clientHeight - 64
            const scaleX = availableWidth / CANVAS_WIDTH
            const scaleY = availableHeight / CANVAS_HEIGHT
            setScale(Math.min(scaleX, scaleY, 1))
          }
        }
      }

      updateScale()
      window.addEventListener("resize", updateScale)
      return () => window.removeEventListener("resize", updateScale)
    }, [])

    const getBackgroundStyle = useCallback(() => {
      const baseStyle: React.CSSProperties = {}

      switch (background.type) {
        case "solid":
          baseStyle.backgroundColor = background.color
          break
        case "gradient":
          baseStyle.background = background.gradient
          break
        case "image":
          baseStyle.backgroundImage = `url(${background.imageUrl})`
          baseStyle.backgroundSize = background.imagePosition
          baseStyle.backgroundPosition = "center"
          baseStyle.backgroundRepeat = "no-repeat"
          break
        case "pattern":
          baseStyle.backgroundColor = background.color
          break
      }

      return baseStyle
    }, [background])

    const handleCanvasClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onSelectElement(null)
      }
    }

    const sortedElements = [...elements]
      .filter((el): el is CanvasElement => el != null && typeof el === "object" && "id" in el)
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

    return (
      <div ref={containerRef} className="relative flex items-center justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            ref={ref}
            className="relative overflow-hidden rounded-lg shadow-2xl ring-1 ring-border"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              ...getBackgroundStyle(),
            }}
            onClick={handleCanvasClick}
            data-canvas="true"
          >
            {background.type === "image" && background.imageBlur > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backdropFilter: `blur(${background.imageBlur}px)`,
                }}
              />
            )}

            {background.overlay?.enabled && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: background.overlay.color,
                  opacity: background.overlay.opacity,
                }}
              />
            )}

            {background.type === "pattern" && (
              <PatternBackground
                type={background.pattern.type}
                color={background.pattern.color}
                size={background.pattern.size}
                opacity={background.pattern.opacity}
              />
            )}

            {showGrid && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}

            {/* Render elements */}
            {sortedElements.map((element) => {
              if (isTextElement(element)) {
                return (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => onSelectElement(element.id)}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                    canvasWidth={CANVAS_WIDTH}
                    canvasHeight={CANVAS_HEIGHT}
                  />
                )
              }
              if (isShapeElement(element)) {
                return (
                  <ShapeElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => onSelectElement(element.id)}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                    canvasWidth={CANVAS_WIDTH}
                    canvasHeight={CANVAS_HEIGHT}
                  />
                )
              }
              if (isImageElement(element)) {
                return (
                  <ImageElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => onSelectElement(element.id)}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                    canvasWidth={CANVAS_WIDTH}
                    canvasHeight={CANVAS_HEIGHT}
                  />
                )
              }
              return null
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground">
          {CANVAS_WIDTH} x {CANVAS_HEIGHT}px (OG Image Standard)
        </div>
      </div>
    )
  },
)

Canvas.displayName = "Canvas"
