'use client'

import { useState } from 'react'
import { useBoards } from '@/hooks/useBoards'
import { BoardCard } from '@/components/BoardList/BoardCard'

export default function Home() {
  const { boards, loaded, createBoard, deleteBoard } = useBoards()
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    const name = newName.trim() || '新しいボード'
    const board = createBoard(name)
    setNewName('')
    window.location.href = `/board/${board.id}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            <span className="mr-2">✦</span>Fusen
          </h1>
          <p className="text-gray-500 text-sm">付箋と模造紙でブレインストーミング</p>
        </div>

        {/* create board */}
        <div className="flex gap-3 mb-10">
          <input
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent text-sm transition-all"
            placeholder="ボード名を入力..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 shadow-sm active:scale-95 transition-colors"
            onClick={handleCreate}
          >
            新規作成
          </button>
        </div>

        {/* board list */}
        {!loaded ? (
          <div className="text-center text-gray-400 py-12 text-sm">読み込み中...</div>
        ) : boards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-gray-400 text-sm">ボードがありません</p>
            <p className="text-gray-300 text-xs mt-1">上のフォームから新規作成してください</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {boards.map(board => (
              <BoardCard key={board.id} board={board} onDelete={deleteBoard} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
