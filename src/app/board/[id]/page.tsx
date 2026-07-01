'use client'

import { use, useCallback } from 'react'
import { Canvas } from '@/components/Board/Canvas'
import { useBoards } from '@/hooks/useBoards'

type Props = {
  params: Promise<{ id: string }>
}

export default function BoardPage({ params }: Props) {
  const { id } = use(params)
  const { boards, updateBoardName } = useBoards()

  const board = boards.find(b => b.id === id)
  const initialName = board?.name ?? '無題のボード'

  const handleNameChange = useCallback((name: string) => {
    updateBoardName(id, name)
  }, [id, updateBoardName])

  return (
    <Canvas
      boardId={id}
      initialName={initialName}
      onNameChange={handleNameChange}
    />
  )
}
