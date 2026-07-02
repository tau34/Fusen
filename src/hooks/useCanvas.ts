'use client'

import { useState, useCallback, useRef } from 'react'

export type CanvasTransform = {
  x: number
  y: number
  scale: number
}

const MIN_SCALE = 0.2
const MAX_SCALE = 3.0

export function useCanvas() {
  const [transform, setTransform] = useState<CanvasTransform>({ x: 0, y: 0, scale: 1 })
  const isPanning = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const onWheelZoom = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    setTransform(prev => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * delta))
      // zoom toward mouse position
      const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale)
      const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale)
      return { x: newX, y: newY, scale: newScale }
    })
  }, [])

  const startPan = useCallback((e: React.PointerEvent) => {
    // middle button or space+left
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      e.preventDefault()
    }
  }, [])

  const movePan = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const endPan = useCallback(() => {
    isPanning.current = false
  }, [])

  const resetTransform = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number, viewportRect: DOMRect) => {
    const x = (screenX - viewportRect.left - transform.x) / transform.scale
    const y = (screenY - viewportRect.top - transform.y) / transform.scale
    return { x, y }
  }, [transform])

  return {
    transform,
    isPanning,
    onWheelZoom,
    startPan,
    movePan,
    endPan,
    resetTransform,
    screenToCanvas,
  }
}
