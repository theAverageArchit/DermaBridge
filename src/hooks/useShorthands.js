import { useLocalStorage } from './useLocalStorage'
import { shorthands as defaultShorthands } from '../data/phrases'

export function useShorthands() {
  const [shorthands, setShorthands] = useLocalStorage('db_shorthands', defaultShorthands)

  const addShorthand = (key, expansion) => {
    setShorthands(prev => ({ ...prev, [key.toLowerCase().trim()]: expansion.trim() }))
  }

  const deleteShorthand = (key) => {
    setShorthands(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const resetToDefaults = () => {
    setShorthands(defaultShorthands)
  }

  return { shorthands, addShorthand, deleteShorthand, resetToDefaults }
}