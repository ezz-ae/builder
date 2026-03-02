"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Template } from "./types"
import { isTextElement } from "./types"

interface TemplateSelectorProps {
  templates: Template[]
  onSelectTemplate: (template: Template) => void
  onClose: () => void
}

export function TemplateSelector({ templates, onSelectTemplate, onClose }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Choose a Template</h2>
            <p className="text-muted-foreground">Start with a pre-designed template or create from scratch</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Blank template */}
          <button
            onClick={onClose}
            className="group relative aspect-[1200/630] overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50 transition-all hover:border-primary hover:bg-muted"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mb-2 text-4xl text-muted-foreground">+</div>
              <span className="font-medium text-foreground">Start from Scratch</span>
              <span className="text-sm text-muted-foreground">Create your own design</span>
            </div>
          </button>

          {/* Template cards */}
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="group relative aspect-[1200/630] overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary hover:ring-2 hover:ring-primary/20"
            >
              <div
                className="absolute inset-0"
                style={
                  template.background.type === "gradient"
                    ? { background: template.background.gradient }
                    : template.background.type === "solid"
                      ? { backgroundColor: template.background.color }
                      : template.background.type === "pattern"
                        ? { backgroundColor: template.background.color }
                        : {
                            backgroundImage: `url(${template.background.imageUrl})`,
                            backgroundSize: "cover",
                          }
                }
              >
                {/* Mini preview of text elements */}
                {template.elements
                  .filter(isTextElement)
                  .slice(0, 3)
                  .map((element) => (
                    <div
                      key={element.id}
                      className="absolute truncate max-w-[80%]"
                      style={{
                        left: `${(element.position.x / 1200) * 100}%`,
                        top: `${(element.position.y / 630) * 100}%`,
                        fontSize: `${element.fontSize * 0.15}px`,
                        fontWeight: element.fontWeight,
                        color: element.color,
                        opacity: 0.9,
                      }}
                    >
                      {element.content}
                    </div>
                  ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="font-medium text-white">{template.name}</span>
                <span className="block text-xs text-white/70">{template.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
