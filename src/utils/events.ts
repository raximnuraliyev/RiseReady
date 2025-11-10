import { type MouseEvent } from 'react'

export const stopPropagation = (e: MouseEvent): void => {
  e.stopPropagation()
}

export const preventDefaultAndStop = (e: MouseEvent): void => {
  e.preventDefault()
  e.stopPropagation()
}