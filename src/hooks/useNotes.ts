'use client'

import { useCallback } from 'react'
import { Note, NoteColor } from '@/types'
import { useLocalStorage } from './useLocalStorage'

const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'orange']

function randomRotation() {
  return (Math.random() - 0.5) * 4
}

export function useNotes(boardId: string) {
  const [notes, setNotes, loaded] = useLocalStorage<Note[]>(`fusen_notes_${boardId}`, [])

  const addNote = useCallback((x: number, y: number, color?: NoteColor) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      x,
      y,
      width: 200,
      height: 200,
      text: '',
      color: color ?? NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      zIndex: Date.now(),
      rotation: randomRotation(),
      createdAt: new Date().toISOString(),
    }
    setNotes(prev => [...prev, newNote])
    return newNote.id
  }, [setNotes])

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
  }, [setNotes])

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [setNotes])

  const bringToFront = useCallback((id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, zIndex: Date.now() } : n))
  }, [setNotes])

  return { notes, loaded, addNote, updateNote, deleteNote, bringToFront }
}
