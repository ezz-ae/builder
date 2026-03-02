"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { TextElement, Position } from "./types"
import { ElementIcon } from "./element-icon"
import { Lock } from "lucide-react"

interface DraggableElementProps {
  element: TextElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<TextElement>) => void
  canvasWidth: number
  canvasHeight: number
}

export function DraggableElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  canvasWidth,
  canvasHeight,
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const editableRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<Position>({ x: 0, y: 0 })

  useEffect(() => {
    if (!isEditing && editableRef.current) {
      editableRef.current.textContent = element.content
    }
  }, [element.content, isEditing])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing || element.locked) return
      e.stopPropagation()
      e.preventDefault()
      onSelect()

      const rect = elementRef.current?.getBoundingClientRect()
      if (rect) {
        dragOffset.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
      setIsDragging(true)
    },
    [isEditing, element.locked, onSelect],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !elementRef.current) return

      const canvas = elementRef.current.parentElement
      if (!canvas) return

      const canvasRect = canvas.getBoundingClientRect()
      const scale = canvasRect.width / canvasWidth

      const newX = (e.clientX - canvasRect.left) / scale - dragOffset.current.x
      const newY = (e.clientY - canvasRect.top) / scale - dragOffset.current.y

      const elementWidth = elementRef.current.offsetWidth
      const elementHeight = elementRef.current.offsetHeight

      const clampedX = Math.max(0, Math.min(newX, canvasWidth - elementWidth))
      const clampedY = Math.max(0, Math.min(newY, canvasHeight - elementHeight))

      onUpdate({ position: { x: clampedX, y: clampedY } })
    },
    [isDragging, canvasWidth, canvasHeight, onUpdate],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (element.locked) return
      e.stopPropagation()
      setIsEditing(true)
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus()
          const range = document.createRange()
          range.selectNodeContents(editableRef.current)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 0)
    },
    [element.locked],
  )

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (editableRef.current) {
      onUpdate({ content: editableRef.current.textContent || "" })
    }
  }, [onUpdate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (editableRef.current) {
          onUpdate({ content: editableRef.current.textContent || "" })
        }
        setIsEditing(false)
      }
      if (e.key === "Escape") {
        if (editableRef.current) {
          editableRef.current.textContent = element.content
        }
        setIsEditing(false)
      }
    },
    [element.content, onUpdate],
  )

  const getTextShadowStyle = () => {
    const shadows: string[] = []

    if (element.effects?.shadow?.enabled) {
      const { offsetX, offsetY, blur, color } = element.effects.shadow
      shadows.push(`${offsetX}px ${offsetY}px ${blur}px ${color}`)
    }

    if (element.effects?.outline?.enabled) {
      const { width, color } = element.effects.outline
      // Create outline effect using multiple shadows
      shadows.push(
        `${width}px 0 0 ${color}`,
        `${-width}px 0 0 ${color}`,
        `0 ${width}px 0 ${color}`,
        `0 ${-width}px 0 ${color}`,
      )
    }

    return shadows.length > 0 ? shadows.join(", ") : undefined
  }

  return (
    <div
      ref={elementRef}
      className={`absolute select-none transition-shadow ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent" : ""
      } ${element.locked ? "cursor-not-allowed" : isDragging ? "opacity-90 cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        backgroundColor: element.showBackground ? element.backgroundColor : "transparent",
        padding: element.showBackground ? "8px 16px" : "4px",
        borderRadius: element.showBackground ? "8px" : "0",
        transform: `rotate(${element.rotation || 0}deg)`,
        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
        lineHeight: element.lineHeight ? element.lineHeight : undefined,
        zIndex: element.zIndex || 1,
        textShadow: getTextShadowStyle(),
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {element.locked && (
        <div className="absolute -top-2 -right-2 bg-muted rounded-full p-1">
          <Lock className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
      <div className="flex items-center gap-2">
        {element.showIcon && element.type !== "name" && element.type !== "custom" && (
          <ElementIcon type={element.type} size={element.fontSize * 0.8} color={element.color} />
        )}
        <div
          ref={editableRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`outline-none whitespace-nowrap ${isEditing ? "cursor-text" : ""}`}
          style={{ minWidth: "50px" }}
        >
          {element.content}
        </div>
      </div>
    </div>
  )
}
