"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Trash2,
  LayoutTemplate,
  User,
  Mail,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Type,
  Undo2,
  Redo2,
  Square,
  Circle,
  Minus,
  ImageIcon,
  Grid3X3,
  Keyboard,
} from "lucide-react"
import type { TextElement, ShapeElement } from "./types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ToolbarProps {
  onAddTextElement: (type: TextElement["type"]) => void
  onAddShapeElement: (type: ShapeElement["type"]) => void
  onAddImageElement: () => void
  onClearCanvas: () => void
  onShowTemplates: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  showGrid: boolean
  onToggleGrid: () => void
}

export function Toolbar({
  onAddTextElement,
  onAddShapeElement,
  onAddImageElement,
  onClearCanvas,
  onShowTemplates,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showGrid,
  onToggleGrid,
}: ToolbarProps) {
  const textElementOptions = [
    { type: "name" as const, label: "Name / Title", icon: User },
    { type: "email" as const, label: "Email", icon: Mail },
    { type: "phone" as const, label: "Phone", icon: Phone },
    { type: "website" as const, label: "Website", icon: Globe },
    { type: "twitter" as const, label: "Twitter / X", icon: Twitter },
    { type: "linkedin" as const, label: "LinkedIn", icon: Linkedin },
    { type: "github" as const, label: "GitHub", icon: Github },
    { type: "instagram" as const, label: "Instagram", icon: Instagram },
    { type: "custom" as const, label: "Custom Text", icon: Type },
  ]

  const shapeElementOptions = [
    { type: "rectangle" as const, label: "Rectangle", icon: Square },
    { type: "circle" as const, label: "Circle", icon: Circle },
    { type: "line" as const, label: "Line", icon: Minus },
    { type: "divider-horizontal" as const, label: "Horizontal Divider", icon: Minus },
    { type: "divider-vertical" as const, label: "Vertical Divider", icon: Minus },
  ]

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-foreground">OG Image Generator</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-2">
          <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button variant="outline" size="sm" onClick={onShowTemplates}>
          <LayoutTemplate className="mr-2 h-4 w-4" />
          Templates
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Element
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Text Elements</DropdownMenuLabel>
            {textElementOptions.map((option) => (
              <DropdownMenuItem key={option.type} onClick={() => onAddTextElement(option.type)}>
                <option.icon className="mr-2 h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Shapes</DropdownMenuLabel>
            {shapeElementOptions.map((option) => (
              <DropdownMenuItem key={option.type} onClick={() => onAddShapeElement(option.type)}>
                <option.icon className="mr-2 h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Media</DropdownMenuLabel>
            <DropdownMenuItem onClick={onAddImageElement}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant={showGrid ? "default" : "outline"} size="sm" onClick={onToggleGrid} title="Toggle Grid">
          <Grid3X3 className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={onClearCanvas}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>

        <div className="h-6 w-px bg-border" />

        {/* Keyboard Shortcuts Help */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" title="Keyboard Shortcuts">
              <Keyboard className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>Quick actions to speed up your workflow</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">General</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Z</kbd>
                    <span className="text-muted-foreground">Undo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+Z</kbd>
                    <span className="text-muted-foreground">Redo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd>
                    <span className="text-muted-foreground">Deselect</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Selected Element</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Delete</kbd>
                    <span className="text-muted-foreground">Delete element</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+D</kbd>
                    <span className="text-muted-foreground">Duplicate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+L</kbd>
                    <span className="text-muted-foreground">Lock/Unlock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+]</kbd>
                    <span className="text-muted-foreground">Bring forward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+[</kbd>
                    <span className="text-muted-foreground">Send backward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Arrow Keys</kbd>
                    <span className="text-muted-foreground">Nudge 1px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift+Arrow</kbd>
                    <span className="text-muted-foreground">Nudge 10px</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
