import { useLocalStorage } from './useLocalStorage'
import { phrases as defaultPhrases } from '../data/phrases'

export function usePhrases() {
  const [phrases, setPhrases] = useLocalStorage('db_phrases', defaultPhrases)

  const addPhrase = (cat, text) => {
    const newPhrase = {
      id: Date.now(),
      cat,
      text: text.trim()
    }
    setPhrases(prev => [...prev, newPhrase])
  }

  const editPhrase = (id, updates) => {
    setPhrases(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    )
  }

  const deletePhrase = (id) => {
    setPhrases(prev => prev.filter(p => p.id !== id))
  }

  const resetToDefaults = () => {
    setPhrases(defaultPhrases)
  }

  return { phrases, addPhrase, editPhrase, deletePhrase, resetToDefaults }
}