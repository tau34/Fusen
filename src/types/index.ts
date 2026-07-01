export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange'

export type Note = {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  color: NoteColor
  zIndex: number
  rotation: number
  createdAt: string
}

export type Board = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
