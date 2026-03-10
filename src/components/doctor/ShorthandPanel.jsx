import { useState } from 'react'

export default function ShorthandPanel({ shorthands, addShorthand, deleteShorthand, resetToDefaults }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newExpansion, setNewExpansion] = useState('')
  const [error, setError] = useState('')

  const entries = Object.entries(shorthands)

  const handleAdd = () => {
    const key = newKey.toLowerCase().trim()
    const expansion = newExpansion.trim()

    if (!key) return setError('Shorthand key is required.')
    if (key.includes(' ')) return setError('Key cannot contain spaces.')
    if (!expansion) return setError('Expansion text is required.')
    if (shorthands[key]) return setError(`'${key}' already exists.`)

    addShorthand(key, expansion)
    setNewKey('')
    setNewExpansion('')
    setError('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setNewKey('')
    setNewExpansion('')
    setError('')
    setIsAdding(false)
  }

  return (
    <div className="border-t border-gray-200 shrink-0">

      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Shorthands
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-300 font-mono">{entries.length}</span>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col">
          <div className="max-h-40 overflow-y-auto px-2 pb-1 flex flex-col gap-1">
            {entries.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">No shorthands defined.</p>
            )}
            {entries.map(([key, expansion]) => (
              <div
                key={key}
                className="group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                  {key}
                </span>
                <span className="text-xs text-gray-500 flex-1 leading-relaxed line-clamp-2">
                  {expansion}
                </span>
                <button
                  onClick={() => deleteShorthand(key)}
                  className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all shrink-0 mt-0.5"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {isAdding ? (
            <div className="mx-2 mb-2 p-2.5 bg-blue-50 rounded-md border border-blue-100 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newKey}
                  onChange={e => { setNewKey(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Escape' && handleCancel()}
                  placeholder="key"
                  className="w-20 text-xs font-mono border border-gray-200 rounded px-2 py-1 bg-white outline-none focus:border-blue-400 placeholder-gray-300"
                />
                <input
                  value={newExpansion}
                  onChange={e => { setNewExpansion(e.target.value); setError('') }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAdd()
                    if (e.key === 'Escape') handleCancel()
                  }}
                  placeholder="expansion text…"
                  className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 bg-white outline-none focus:border-blue-400 placeholder-gray-300"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-1.5 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newKey.trim() || !newExpansion.trim()}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 pb-2.5">
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                + Add shorthand
              </button>
              <button
                onClick={resetToDefaults}
                className="text-xs text-gray-400 hover:text-amber-600 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}