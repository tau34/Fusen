'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { NoteColor } from '@/types'
import { useCanvas } from '@/hooks/useCanvas'
import { useNotes } from '@/hooks/useNotes'
import { StickyNote } from './StickyNote'
import { Toolbar } from './Toolbar'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Props = {
  boardId: string
  initialName: string
  onNameChange: (name: string) => void
}

export function Canvas({ boardId, initialName, onNameChange }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const { transform, isPanning, onWheelZoom, startPan, movePan, endPan, resetTransform, screenToCanvas } = useCanvas()
  const { notes, loaded, addNote, updateNote, deleteNote, bringToFront } = useNotes(boardId)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useLocalStorage<NoteColor>('fusen_selected_color', 'yellow')
  const [boardName, setBoardName] = useState(initialName)

  const handleBoardNameChange = useCallback((name: string) => {
    setBoardName(name)
    onNameChange(name)
  }, [onNameChange])

  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    const { x, y } = screenToCanvas(e.clientX, e.clientY, rect)
    const id = addNote(x - 100, y - 100, selectedColor)
    setSelectedNoteId(id)
  }, [addNote, screenToCanvas, selectedColor])

  const handleAddNote = useCallback(() => {
    if (!viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const { x, y } = screenToCanvas(rect.left + cx, rect.top + cy, rect)
    const id = addNote(x - 100, y - 100, selectedColor)
    setSelectedNoteId(id)
  }, [addNote, screenToCanvas, selectedColor])

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    setSelectedNoteId(null)
    startPan(e)
  }, [startPan])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = document.activeElement
        if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) return
        if (selectedNoteId) {
          deleteNote(selectedNoteId)
          setSelectedNoteId(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNoteId, deleteNote])

  const dotSize = Math.max(1, transform.scale)
  const dotGap = 24 * transform.scale

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* back to home */}
      <a
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.1)' }}
      >
        ← ボード一覧
      </a>

      <Toolbar
        boardName={boardName}
        selectedColor={selectedColor}
        zoomLevel={transform.scale}
        onAddNote={handleAddNote}
        onColorChange={setSelectedColor}
        onZoomReset={resetTransform}
        onBoardNameChange={handleBoardNameChange}
      />

      {/* canvas viewport */}
      <div
        ref={viewportRef}
        className="w-full h-full"
        style={{
          cursor: isPanning.current ? 'grabbing' : 'default',
          userSelect: 'none',
        }}
        onWheel={onWheelZoom}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={movePan}
        onPointerUp={endPan}
        onDoubleClick={handleCanvasDoubleClick}
      >
        {/* dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ccc ${dotSize}px, transparent ${dotSize}px)`,
            backgroundSize: `${dotGap}px ${dotGap}px`,
            backgroundPosition: `${transform.x % dotGap}px ${transform.y % dotGap}px`,
          }}
        />

        {/* transformed canvas */}
        <div
          className="absolute"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            width: 0,
            height: 0,
          }}
        >
          {loaded && notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              scale={transform.scale}
              isSelected={selectedNoteId === note.id}
              onSelect={setSelectedNoteId}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onBringToFront={bringToFront}
            />
          ))}
        </div>
      </div>

      {/* hint */}
      {loaded && notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <p className="text-2xl mb-2">✦</p>
            <p className="text-sm">ダブルクリックで付箋を追加</p>
            <p className="text-xs mt-1">ホイールでズーム、Alt+ドラッグでパン</p>
          </div>
        </div>
      )}
    </div>
  )
}
