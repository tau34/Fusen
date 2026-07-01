'use client'

import { useCallback } from 'react'
import { Board } from '@/types'
import { useLocalStorage } from './useLocalStorage'

export function useBoards() {
  const [boards, setBoards, loaded] = useLocalStorage<Board[]>('fusen_boards', [])

  const createBoard = useCallback((name: string) => {
    const now = new Date().toISOString()
    const board: Board = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
    }
    setBoards(prev => [board, ...prev])
    return board
  }, [setBoards])

  const deleteBoard = useCallback((id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id))
    // also remove notes for that board
    try {
      localStorage.removeItem(`fusen_notes_${id}`)
    } catch { /* ignore */ }
  }, [setBoards])

  const updateBoardName = useCallback((id: string, name: string) => {
    const now = new Date().toISOString()
    setBoards(prev => prev.map(b => b.id === id ? { ...b, name, updatedAt: now } : b))
  }, [setBoards])

  return { boards, loaded, createBoard, deleteBoard, updateBoardName }
}
