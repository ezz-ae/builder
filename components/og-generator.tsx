"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Canvas } from "./canvas"
import { Sidebar } from "./sidebar"
import { Toolbar } from "./toolbar"
import { TemplateSelector } from "./template-selector"
import { LandingPage } from "./landing-page"
import type {
  TextElement,
  ShapeElement,
  ImageElement,
  CanvasElement,
  BackgroundConfig,
  Template,
  ProjectData,
} from "./types"
import { DEFAULT_BACKGROUND, DEFAULT_TEXT_EFFECTS } from "./types"
import { TEMPLATES } from "./templates"
import { useHistory } from "./use-history"
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts"
import { expandProjectData, decompressFromBase64 } from "./export-panel"

export function OGGenerator() {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [background, setBackground] = useState<BackgroundConfig>(DEFAULT_BACKGROUND)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [nextZIndex, setNextZIndex] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { pushState, undo, redo, canUndo, canRedo, reset } = useHistory(elements, background)

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Try new minified format first (p=)
    const minifiedParam = params.get("p")
    if (minifiedParam) {
      try {
        const decoded = decompressFromBase64(minifiedParam)
        const minified = JSON.parse(decoded)
        const data = expandProjectData(minified)
        setElements(data.elements)
        setBackground(data.background)
        setShowLanding(false)
        setShowTemplates(false)
        const maxZ = Math.max(...data.elements.map((el) => el.zIndex || 0), 0)
        setNextZIndex(maxZ + 1)
        window.history.replaceState({}, "", window.location.pathname)
        return
      } catch (err) {
        console.error("[v0] Failed to load minified project from URL:", err)
      }
    }

    // Fall back to old format (project=)
    const projectParam = params.get("project")
    if (projectParam) {
      try {
        const decoded = decodeURIComponent(atob(projectParam))
        const data = JSON.parse(decoded) as ProjectData
        setElements(data.elements)
        setBackground(data.background)
        setShowLanding(false)
        setShowTemplates(false)
        const maxZ = Math.max(...data.elements.map((el) => el.zIndex || 0), 0)
        setNextZIndex(maxZ + 1)
        window.history.replaceState({}, "", window.location.pathname)
      } catch (err) {
        console.error("[v0] Failed to load project from URL:", err)
      }
    }
  }, [])

  const handleGetStarted = useCallback(() => {
    setShowLanding(false)
    setShowTemplates(false)
  }, [])

  const addTextElement = useCallback(
    (type: TextElement["type"]) => {
      const newElement: TextElement = {
        id: `element-${Date.now()}`,
        type,
        content: getDefaultContent(type),
        position: { x: 100, y: 100 + (elements.length % 5) * 50 },
        fontFamily: "Geist, sans-serif",
        fontSize: type === "name" ? 48 : 24,
        fontWeight: type === "name" ? 700 : 400,
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.5)",
        showBackground: false,
        textAlign: "left",
        showIcon: true,
        rotation: 0,
        letterSpacing: 0,
        lineHeight: 1,
        locked: false,
        zIndex: nextZIndex,
        effects: { ...DEFAULT_TEXT_EFFECTS },
      }
      const newElements = [...elements, newElement]
      setElements(newElements)
      setSelectedElementId(newElement.id)
      setNextZIndex((prev) => prev + 1)
      pushState(newElements, background)
    },
    [elements, background, nextZIndex, pushState],
  )

  const addShapeElement = useCallback(
    (type: ShapeElement["type"]) => {
      const isLine = type === "line" || type === "divider-horizontal" || type === "divider-vertical"
      const newElement: ShapeElement = {
        id: `shape-${Date.now()}`,
        type,
        position: { x: 100, y: 100 + (elements.length % 5) * 50 },
        width: isLine ? (type === "divider-vertical" ? 4 : 200) : 150,
        height: isLine ? (type === "divider-vertical" ? 200 : 4) : 150,
        fill: isLine ? "transparent" : "#ffffff20",
        stroke: "#ffffff",
        strokeWidth: isLine ? 2 : 0,
        opacity: 1,
        rotation: 0,
        locked: false,
        zIndex: nextZIndex,
        borderRadius: type === "rectangle" ? 8 : 0,
      }
      const newElements = [...elements, newElement]
      setElements(newElements)
      setSelectedElementId(newElement.id)
      setNextZIndex((prev) => prev + 1)
      pushState(newElements, background)
    },
    [elements, background, nextZIndex, pushState],
  )

  const addImageElement = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string
          const newElement: ImageElement = {
            id: `image-${Date.now()}`,
            type: "image",
            position: { x: 100, y: 100 },
            width: 200,
            height: 200,
            imageUrl,
            opacity: 1,
            rotation: 0,
            locked: false,
            zIndex: nextZIndex,
            borderRadius: 0,
            objectFit: "cover",
          }
          const newElements = [...elements, newElement]
          setElements(newElements)
          setSelectedElementId(newElement.id)
          setNextZIndex((prev) => prev + 1)
          pushState(newElements, background)
        }
        reader.readAsDataURL(file)
      }
      if (e.target) {
        e.target.value = ""
      }
    },
    [elements, background, nextZIndex, pushState],
  )

  const updateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      const newElements = elements.map((el) => (el.id === id ? { ...el, ...updates } : el)) as CanvasElement[]
      setElements(newElements)
    },
    [elements],
  )

  const updateElementWithHistory = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      const newElements = elements.map((el) => (el.id === id ? { ...el, ...updates } : el)) as CanvasElement[]
      setElements(newElements)
      pushState(newElements, background)
    },
    [elements, background, pushState],
  )

  const deleteElement = useCallback(
    (id: string) => {
      const newElements = elements.filter((el) => el.id !== id)
      setElements(newElements)
      if (selectedElementId === id) {
        setSelectedElementId(null)
      }
      pushState(newElements, background)
    },
    [elements, selectedElementId, background, pushState],
  )

  const duplicateElement = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id)
      if (element) {
        const newElement = {
          ...element,
          id: `element-${Date.now()}`,
          position: { x: element.position.x + 20, y: element.position.y + 20 },
          zIndex: nextZIndex,
          locked: false,
        }
        const newElements = [...elements, newElement]
        setElements(newElements)
        setSelectedElementId(newElement.id)
        setNextZIndex((prev) => prev + 1)
        pushState(newElements, background)
      }
    },
    [elements, background, nextZIndex, pushState],
  )

  const toggleLock = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id)
      if (element) {
        updateElementWithHistory(id, { locked: !element.locked })
      }
    },
    [elements, updateElementWithHistory],
  )

  const bringForward = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id)
      if (!element) return

      const maxZIndex = Math.max(...elements.map((el) => el.zIndex || 0))
      if ((element.zIndex || 0) < maxZIndex) {
        const newElements = elements.map((el) => {
          if (el.id === id) {
            return { ...el, zIndex: (element.zIndex || 0) + 1 }
          }
          if ((el.zIndex || 0) === (element.zIndex || 0) + 1) {
            return { ...el, zIndex: (el.zIndex || 0) - 1 }
          }
          return el
        }) as CanvasElement[]
        setElements(newElements)
        pushState(newElements, background)
      }
    },
    [elements, background, pushState],
  )

  const sendBackward = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id)
      if (!element) return

      const minZIndex = Math.min(...elements.map((el) => el.zIndex || 0))
      if ((element.zIndex || 0) > minZIndex) {
        const newElements = elements.map((el) => {
          if (el.id === id) {
            return { ...el, zIndex: (element.zIndex || 0) - 1 }
          }
          if ((el.zIndex || 0) === (element.zIndex || 0) - 1) {
            return { ...el, zIndex: (el.zIndex || 0) + 1 }
          }
          return el
        }) as CanvasElement[]
        setElements(newElements)
        pushState(newElements, background)
      }
    },
    [elements, background, pushState],
  )

  const nudgeElement = useCallback(
    (id: string, dx: number, dy: number) => {
      const element = elements.find((el) => el.id === id)
      if (element && !element.locked) {
        updateElement(id, {
          position: {
            x: Math.max(0, element.position.x + dx),
            y: Math.max(0, element.position.y + dy),
          },
        })
      }
    },
    [elements, updateElement],
  )

  const handleUndo = useCallback(() => {
    const state = undo()
    if (state) {
      setElements(state.elements)
      setBackground(state.background)
      setSelectedElementId(null)
    }
  }, [undo])

  const handleRedo = useCallback(() => {
    const state = redo()
    if (state) {
      setElements(state.elements)
      setBackground(state.background)
      setSelectedElementId(null)
    }
  }, [redo])

  const updateBackground = useCallback(
    (newBackground: BackgroundConfig) => {
      setBackground(newBackground)
      pushState(elements, newBackground)
    },
    [elements, pushState],
  )

  const applyTemplate = useCallback(
    (template: Template) => {
      const newElements = template.elements.map((el, i) => ({
        ...el,
        id: `element-${Date.now()}-${i}`,
      }))
      setBackground(template.background)
      setElements(newElements)
      setSelectedElementId(null)
      setShowTemplates(false)
      setShowLanding(false)
      setNextZIndex(newElements.length + 1)
      reset(newElements, template.background)
    },
    [reset],
  )

  const clearCanvas = useCallback(() => {
    setElements([])
    setSelectedElementId(null)
    setBackground(DEFAULT_BACKGROUND)
    setNextZIndex(1)
    reset([], DEFAULT_BACKGROUND)
  }, [reset])

  const loadProject = useCallback(
    (data: ProjectData) => {
      setElements(data.elements)
      setBackground(data.background)
      setSelectedElementId(null)
      setShowTemplates(false)
      setShowLanding(false)
      const maxZ = Math.max(...data.elements.map((el) => el.zIndex || 0), 0)
      setNextZIndex(maxZ + 1)
      reset(data.elements, data.background)
    },
    [reset],
  )

  useKeyboardShortcuts({
    selectedElementId,
    elements,
    onDelete: deleteElement,
    onDuplicate: duplicateElement,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onNudge: nudgeElement,
    onSelectAll: () => {},
    onDeselect: () => setSelectedElementId(null),
    onToggleLock: toggleLock,
    onBringForward: bringForward,
    onSendBackward: sendBackward,
  })

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <div className="flex h-screen flex-col">
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <Toolbar
        onAddTextElement={addTextElement}
        onAddShapeElement={addShapeElement}
        onAddImageElement={addImageElement}
        onClearCanvas={clearCanvas}
        onShowTemplates={() => setShowTemplates(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-8 overflow-auto">
          <Canvas
            ref={canvasRef}
            elements={elements}
            background={background}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={updateElement}
            showGrid={showGrid}
          />
        </div>
        <Sidebar
          selectedElement={selectedElement}
          onUpdateElement={updateElementWithHistory}
          onDeleteElement={deleteElement}
          onDuplicateElement={duplicateElement}
          background={background}
          onUpdateBackground={updateBackground}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onToggleLock={toggleLock}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          canvasRef={canvasRef}
          onLoadProject={loadProject}
        />
      </div>
      {showTemplates && (
        <TemplateSelector
          templates={TEMPLATES}
          onSelectTemplate={applyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  )
}

function getDefaultContent(type: TextElement["type"]): string {
  switch (type) {
    case "name":
      return "Your Name"
    case "email":
      return "hello@example.com"
    case "phone":
      return "+1 234 567 890"
    case "website":
      return "example.com"
    case "twitter":
      return "@username"
    case "linkedin":
      return "linkedin.com/in/username"
    case "github":
      return "github.com/username"
    case "instagram":
      return "@username"
    case "custom":
      return "Custom Text"
    default:
      return "Text"
  }
}
