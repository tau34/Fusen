'use client'

import { Board } from '@/types'

type Props = {
  board: Board
  onDelete: (id: string) => void
}

const CARD_COLORS = [
  'from-yellow-100 to-yellow-200',
  'from-pink-100 to-pink-200',
  'from-sky-100 to-sky-200',
  'from-green-100 to-green-200',
  'from-orange-100 to-orange-200',
]

function cardColor(id: string) {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return CARD_COLORS[hash % CARD_COLORS.length]
}

export function BoardCard({ board, onDelete }: Props) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`「${board.name}」を削除しますか？`)) {
      onDelete(board.id)
    }
  }

  const date = new Date(board.updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <a
      href={`/board/${board.id}`}
      className={`group relative block rounded-xl bg-gradient-to-br ${cardColor(board.id)} p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-white/50`}
    >
      <button
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-lg leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/50"
        onClick={handleDelete}
        title="削除"
      >
        ×
      </button>
      <div className="flex flex-col h-24 justify-between">
        <p className="text-sm font-semibold text-gray-700 line-clamp-2 pr-4">{board.name}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </a>
  )
}
