'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Note, NoteColor } from '@/types'

const COLOR_CLASSES: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  blue: 'bg-sky-200',
  green: 'bg-green-200',
  orange: 'bg-orange-200',
}

const COLOR_HEADER_CLASSES: Record<NoteColor, string> = {
  yellow: 'bg-yellow-300',
  pink: 'bg-pink-300',
  blue: 'bg-sky-300',
  green: 'bg-green-300',
  orange: 'bg-orange-300',
}

type Props = {
  note: Note
  scale: number
  isSelected: boolean
  onSelect: (id: string) => void
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onBringToFront: (id: string) => void
}

export function StickyNote({ note, scale, isSelected, onSelect, onUpdate, onDelete, onBringToFront }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<{ mouseX: number; mouseY: number; noteX: number; noteY: number } | null>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isEditing) return
    e.stopPropagation()
    onSelect(note.id)
    onBringToFront(note.id)
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      noteX: note.x,
      noteY: note.y,
    }
    isDragging.current = false
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [isEditing, note.id, note.x, note.y, onSelect, onBringToFront])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return
    const dx = (e.clientX - dragStart.current.mouseX) / scale
    const dy = (e.clientY - dragStart.current.mouseY) / scale
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDragging.current = true
    }
    if (isDragging.current) {
      onUpdate(note.id, {
        x: dragStart.current.noteX + dx,
        y: dragStart.current.noteY + dy,
      })
    }
  }, [note.id, scale, onUpdate])

  const handlePointerUp = useCallback(() => {
    dragStart.current = null
  }, [])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }, [])

  const handleTextBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { text: e.target.value })
  }, [note.id, onUpdate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
    // allow Enter for newlines in textarea
  }, [])

  return (
    <div
      ref={noteRef}
      className={`absolute select-none ${COLOR_CLASSES[note.color]} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
      }`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
        transform: `rotate(${note.rotation}deg)`,
        boxShadow: '3px 3px 8px rgba(0,0,0,0.2)',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* header strip */}
      <div className={`${COLOR_HEADER_CLASSES[note.color]} flex items-center justify-between px-2 py-1 flex-shrink-0`}
        style={{ borderRadius: '2px 2px 0 0' }}>
        <span className="text-xs text-gray-500 opacity-60">✦</span>
        <button
          className="text-gray-500 hover:text-red-600 opacity-60 hover:opacity-100 transition-opacity text-sm leading-none"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onDelete(note.id) }}
        >
          ×
        </button>
      </div>

      {/* text area */}
      <div className="flex-1 p-2 overflow-hidden">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="w-full h-full resize-none bg-transparent outline-none text-sm text-gray-800 font-medium leading-relaxed"
            value={note.text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            placeholder="テキストを入力..."
          />
        ) : (
          <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-wrap break-words h-full overflow-hidden">
            {note.text || <span className="text-gray-400 text-xs">ダブルクリックで編集</span>}
          </p>
        )}
      </div>
    </div>
  )
}
