"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lock, Unlock, ChevronUp, ChevronDown, Trash2, Type, Square, Circle, Minus, ImageIcon } from "lucide-react"
import type { CanvasElement } from "./types"
import { isTextElement, isShapeElement, isImageElement } from "./types"

interface LayersPanelProps {
  elements: CanvasElement[]
  selectedElementId: string | null
  onSelectElement: (id: string) => void
  onDeleteElement: (id: string) => void
  onToggleLock: (id: string) => void
  onBringForward: (id: string) => void
  onSendBackward: (id: string) => void
}

export function LayersPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onToggleLock,
  onBringForward,
  onSendBackward,
}: LayersPanelProps) {
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex)

  const getElementIcon = (element: CanvasElement) => {
    if (isTextElement(element)) {
      return <Type className="h-4 w-4" />
    }
    if (isShapeElement(element)) {
      switch (element.type) {
        case "circle":
          return <Circle className="h-4 w-4" />
        case "line":
        case "divider-horizontal":
        case "divider-vertical":
          return <Minus className="h-4 w-4" />
        default:
          return <Square className="h-4 w-4" />
      }
    }
    if (isImageElement(element)) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <Square className="h-4 w-4" />
  }

  const getElementLabel = (element: CanvasElement) => {
    if (isTextElement(element)) {
      return element.content.slice(0, 20) + (element.content.length > 20 ? "..." : "")
    }
    if (isShapeElement(element)) {
      return element.type.charAt(0).toUpperCase() + element.type.slice(1).replace("-", " ")
    }
    if (isImageElement(element)) {
      return "Image"
    }
    return "Element"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Layers ({elements.length})</h3>
      </div>
      <ScrollArea className="h-[200px] rounded-md border border-border">
        <div className="p-2 space-y-1">
          {sortedElements.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">No elements yet</div>
          ) : (
            sortedElements.map((element) => (
              <div
                key={element.id}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedElementId === element.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => onSelectElement(element.id)}
              >
                <span className="text-muted-foreground">{getElementIcon(element)}</span>
                <span className="flex-1 text-sm truncate">{getElementLabel(element)}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleLock(element.id)
                    }}
                  >
                    {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onBringForward(element.id)
                    }}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSendBackward(element.id)
                    }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteElement(element.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
