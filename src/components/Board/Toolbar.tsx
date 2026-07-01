'use client'

import { NoteColor } from '@/types'

const COLORS: { color: NoteColor; bg: string; label: string }[] = [
  { color: 'yellow', bg: 'bg-yellow-300', label: '黄' },
  { color: 'pink', bg: 'bg-pink-300', label: 'ピンク' },
  { color: 'blue', bg: 'bg-sky-300', label: '水色' },
  { color: 'green', bg: 'bg-green-300', label: '緑' },
  { color: 'orange', bg: 'bg-orange-300', label: 'オレンジ' },
]

type Props = {
  boardName: string
  selectedColor: NoteColor
  zoomLevel: number
  onAddNote: () => void
  onColorChange: (color: NoteColor) => void
  onZoomReset: () => void
  onBoardNameChange: (name: string) => void
}

export function Toolbar({
  boardName,
  selectedColor,
  zoomLevel,
  onAddNote,
  onColorChange,
  onZoomReset,
  onBoardNameChange,
}: Props) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full shadow-lg"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.1)' }}
    >
      {/* board name */}
      <input
        className="text-sm font-semibold text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-gray-400 transition-colors w-32 text-center"
        value={boardName}
        onChange={e => onBoardNameChange(e.target.value)}
        placeholder="ボード名"
      />

      <div className="w-px h-5 bg-gray-200" />

      {/* add note button */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors active:scale-95"
        onClick={onAddNote}
        title="付箋を追加 (ダブルクリックでも追加できます)"
      >
        <span className="text-base leading-none">+</span>
        <span>付箋追加</span>
      </button>

      <div className="w-px h-5 bg-gray-200" />

      {/* color picker */}
      <div className="flex items-center gap-1.5">
        {COLORS.map(({ color, bg }) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full ${bg} transition-all ${
              selectedColor === color ? 'ring-2 ring-offset-1 ring-gray-500 scale-110' : 'hover:scale-110'
            }`}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-gray-200" />

      {/* zoom */}
      <button
        className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-mono min-w-[3rem] text-center"
        onClick={onZoomReset}
        title="ズームリセット"
      >
        {Math.round(zoomLevel * 100)}%
      </button>
    </div>
  )
}
