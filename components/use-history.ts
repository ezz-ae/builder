"use client"

import { useState, useCallback } from "react"
import type { CanvasElement, BackgroundConfig, HistoryState } from "./types"

const MAX_HISTORY_SIZE = 50

export function useHistory(initialElements: CanvasElement[], initialBackground: BackgroundConfig) {
  const [history, setHistory] = useState<HistoryState[]>([{ elements: initialElements, background: initialBackground }])
  const [currentIndex, setCurrentIndex] = useState(0)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const pushState = useCallback(
    (elements: CanvasElement[], background: BackgroundConfig) => {
      setHistory((prev) => {
        // Remove any future states if we're not at the end
        const newHistory = prev.slice(0, currentIndex + 1)
        // Add new state
        newHistory.push({ elements: [...elements], background: { ...background } })
        // Limit history size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift()
          return newHistory
        }
        return newHistory
      })
      setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY_SIZE - 1))
    },
    [currentIndex],
  )

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [canUndo, currentIndex, history])

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [canRedo, currentIndex, history])

  const reset = useCallback((elements: CanvasElement[], background: BackgroundConfig) => {
    setHistory([{ elements: [...elements], background: { ...background } }])
    setCurrentIndex(0)
  }, [])

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  }
}
