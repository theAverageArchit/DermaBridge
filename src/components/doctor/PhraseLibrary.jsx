import { useState } from 'react'
import { categories } from '../../data/phrases'
import { usePhrases } from '../../hooks/usePhrases'
import ShorthandPanel from './ShorthandPanel'

export default function PhraseLibrary({ onSelectPhrase, shorthands, addShorthand, deleteShorthand, resetShorthands }) {
  const [activeCat, setActiveCat] = useState('all')
  const [flash, setFlash] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newText, setNewText] = useState('')
  const [newCat, setNewCat] = useState('greetings')
  const [editText, setEditText] = useState('')

  const { phrases, addPhrase, editPhrase, deletePhrase, resetToDefaults } = usePhrases()

  const filtered = activeCat === 'all'
    ? phrases
    : phrases.filter(p => p.cat === activeCat)

  const handleSelect = (phrase) => {
    onSelectPhrase(phrase.text)
    setFlash(phrase.id)
    setTimeout(() => setFlash(null), 600)
  }

  const handleAdd = () => {
    if (!newText.trim()) return
    addPhrase(newCat, newText)
    setNewText('')
    setIsAdding(false)
  }

  const handleEditStart = (phrase) => {
    setEditingId(phrase.id)
    setEditText(phrase.text)
  }

  const handleEditSave = (id) => {
    if (!editText.trim()) return
    editPhrase(id, { text: editText })
    setEditingId(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText('')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Phrase Library
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsAdding(true); setActiveCat(newCat) }}
            title="Add phrase"
            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={resetToDefaults}
            title="Reset to defaults"
            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 6A4.5 4.5 0 1 0 3 2.5L1.5 1M1.5 1v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
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

      {/* Add Phrase Form */}
      {isAdding && (
        <div className="p-3 border-b border-gray-200 bg-blue-50 flex flex-col gap-2">
          <select
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-600 outline-none focus:border-blue-400"
          >
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <textarea
            autoFocus
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() }
              if (e.key === 'Escape') setIsAdding(false)
            }}
            placeholder="Type new phrase…"
            rows={2}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 outline-none focus:border-blue-400 resize-none placeholder-gray-300"
          />
          <div className="flex gap-1.5 justify-end">
            <button
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newText.trim()}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Phrases */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">
            No phrases in this category.
          </p>
        )}
        {filtered.map(phrase => (
          <div key={phrase.id} className="group relative">
            {editingId === phrase.id ? (
              <div className="flex flex-col gap-1.5 p-2 bg-blue-50 rounded-md border border-blue-100">
                <textarea
                  autoFocus
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSave(phrase.id) }
                    if (e.key === 'Escape') handleEditCancel()
                  }}
                  rows={2}
                  className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 outline-none focus:border-blue-400 resize-none"
                />
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={handleEditCancel}
                    className="px-2 py-0.5 text-xs text-gray-500 border border-gray-200 rounded hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSave(phrase.id)}
                    className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleSelect(phrase)}
                className={`w-full text-left px-3 py-2 rounded-md text-xs leading-relaxed border transition-colors ${
                  flash === phrase.id
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                }`}
              >
                {phrase.text}
              </button>
            )}

            {editingId !== phrase.id && (
              <div className="absolute right-1 top-1 hidden group-hover:flex gap-0.5">
                <button
                  onClick={() => handleEditStart(phrase)}
                  className="w-5 h-5 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 8L1 6L6 1L8 3L3 8L1 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => deletePhrase(phrase.id)}
                  className="w-5 h-5 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ShorthandPanel
        shorthands={shorthands}
        addShorthand={addShorthand}
        deleteShorthand={deleteShorthand}
        resetToDefaults={resetShorthands}
      />

    </aside>
  )
}