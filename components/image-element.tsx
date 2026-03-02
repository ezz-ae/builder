"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import type { ImageElement as ImageElementType, Position } from "./types"

interface ImageElementProps {
  element: ImageElementType
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<ImageElementType>) => void
  canvasWidth: number
  canvasHeight: number
}

export function ImageElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  canvasWidth,
  canvasHeight,
}: ImageElementProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<Position>({ x: 0, y: 0 })
  const resizeStart = useRef<{ width: number; height: number; x: number; y: number }>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (element.locked) return
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
    [element.locked, onSelect],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (element.locked) return
      e.stopPropagation()
      e.preventDefault()
      setIsResizing(true)
      resizeStart.current = {
        width: element.width,
        height: element.height,
        x: e.clientX,
        y: e.clientY,
      }
    },
    [element.locked, element.width, element.height],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!elementRef.current) return

      const canvas = elementRef.current.parentElement
      if (!canvas) return

      const canvasRect = canvas.getBoundingClientRect()
      const scale = canvasRect.width / canvasWidth

      if (isDragging) {
        const newX = (e.clientX - canvasRect.left) / scale - dragOffset.current.x
        const newY = (e.clientY - canvasRect.top) / scale - dragOffset.current.y

        const clampedX = Math.max(0, Math.min(newX, canvasWidth - element.width))
        const clampedY = Math.max(0, Math.min(newY, canvasHeight - element.height))

        onUpdate({ position: { x: clampedX, y: clampedY } })
      }

      if (isResizing) {
        const dx = (e.clientX - resizeStart.current.x) / scale
        const dy = (e.clientY - resizeStart.current.y) / scale

        const newWidth = Math.max(20, resizeStart.current.width + dx)
        const newHeight = Math.max(20, resizeStart.current.height + dy)

        onUpdate({ width: newWidth, height: newHeight })
      }
    },
    [isDragging, isResizing, canvasWidth, canvasHeight, element.width, element.height, onUpdate],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={elementRef}
      className={`absolute select-none overflow-hidden ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent" : ""
      } ${element.locked ? "cursor-not-allowed opacity-80" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
        borderRadius: element.borderRadius,
        opacity: element.opacity,
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={element.imageUrl || "/placeholder.svg"}
        alt="Element"
        className="h-full w-full pointer-events-none"
        style={{ objectFit: element.objectFit }}
        crossOrigin="anonymous"
      />
      {isSelected && !element.locked && (
        <div
          className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm bg-blue-500 border-2 border-white"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  )
}
