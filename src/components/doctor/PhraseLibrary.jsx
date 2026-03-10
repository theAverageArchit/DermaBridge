import { useState } from 'react'
import { phrases, categories } from '../../data/phrases'

export default function PhraseLibrary({ onSelectPhrase }) {
  const [activeCat, setActiveCat] = useState('all')
  const [flash, setFlash] = useState(null)

  const filtered = activeCat === 'all'
    ? phrases
    : phrases.filter(p => p.cat === activeCat)

  const handleSelect = (phrase) => {
    onSelectPhrase(phrase.text)
    setFlash(phrase.id)
    setTimeout(() => setFlash(null), 600)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Phrase Library
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2.5 border-b border-gray-200">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCat === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Phrases */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {filtered.map(phrase => (
          <button
            key={phrase.id}
            onClick={() => handleSelect(phrase)}
            className={`text-left px-3 py-2 rounded-md text-xs leading-relaxed border transition-colors ${
              flash === phrase.id
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-transparent text-gray-500 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
            }`}
          >
            {phrase.text}
          </button>
        ))}
      </div>

    </aside>
  )
}