"use client"

import { useEffect, useCallback } from "react"
import type { CanvasElement } from "./types"

interface UseKeyboardShortcutsProps {
  selectedElementId: string | null
  elements: CanvasElement[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onUndo: () => void
  onRedo: () => void
  onNudge: (id: string, dx: number, dy: number) => void
  onSelectAll: () => void
  onDeselect: () => void
  onToggleLock: (id: string) => void
  onBringForward: (id: string) => void
  onSendBackward: (id: string) => void
}

export function useKeyboardShortcuts({
  selectedElementId,
  elements,
  onDelete,
  onDuplicate,
  onUndo,
  onRedo,
  onNudge,
  onDeselect,
  onToggleLock,
  onBringForward,
  onSendBackward,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey

      // Undo: Ctrl/Cmd + Z
      if (ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        onUndo()
        return
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((ctrlKey && e.shiftKey && e.key === "z") || (ctrlKey && e.key === "y")) {
        e.preventDefault()
        onRedo()
        return
      }

      // Need a selected element for the rest
      if (!selectedElementId) return

      const selectedElement = elements.find((el) => el.id === selectedElementId)
      if (!selectedElement || selectedElement.locked) return

      // Delete: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        onDelete(selectedElementId)
        return
      }

      // Duplicate: Ctrl/Cmd + D
      if (ctrlKey && e.key === "d") {
        e.preventDefault()
        onDuplicate(selectedElementId)
        return
      }

      // Lock/Unlock: Ctrl/Cmd + L
      if (ctrlKey && e.key === "l") {
        e.preventDefault()
        onToggleLock(selectedElementId)
        return
      }

      // Bring Forward: Ctrl/Cmd + ]
      if (ctrlKey && e.key === "]") {
        e.preventDefault()
        onBringForward(selectedElementId)
        return
      }

      // Send Backward: Ctrl/Cmd + [
      if (ctrlKey && e.key === "[") {
        e.preventDefault()
        onSendBackward(selectedElementId)
        return
      }

      // Nudge with arrow keys
      const nudgeAmount = e.shiftKey ? 10 : 1
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          onNudge(selectedElementId, 0, -nudgeAmount)
          break
        case "ArrowDown":
          e.preventDefault()
          onNudge(selectedElementId, 0, nudgeAmount)
          break
        case "ArrowLeft":
          e.preventDefault()
          onNudge(selectedElementId, -nudgeAmount, 0)
          break
        case "ArrowRight":
          e.preventDefault()
          onNudge(selectedElementId, nudgeAmount, 0)
          break
      }

      // Escape to deselect
      if (e.key === "Escape") {
        e.preventDefault()
        onDeselect()
        return
      }
    },
    [
      selectedElementId,
      elements,
      onDelete,
      onDuplicate,
      onUndo,
      onRedo,
      onNudge,
      onDeselect,
      onToggleLock,
      onBringForward,
      onSendBackward,
    ],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
