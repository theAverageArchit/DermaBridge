import { useRef, useEffect } from 'react'
import { acTerms } from '../../data/phrases'

export default function ComposeArea({ draft, onChange, onSend, shorthands }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (draft) textareaRef.current?.focus()
  }, [draft])

  // ── Autocomplete ──
  const getSuggestions = (text) => {
    if (!text.trim()) return []
    const last = text.split(/\s+/).at(-1).toLowerCase()
    if (last.length < 2) return []
    return acTerms.filter(t => t.startsWith(last) && t !== last).slice(0, 5)
  }

  const acceptSuggestion = (term) => {
    const words = draft.split(/\s+/)
    words[words.length - 1] = term
    onChange(words.join(' ') + ' ')
    textareaRef.current?.focus()
  }

  // ── Shorthand ──
  const getShorthandHint = (text) => {
    const last = text.trim().split(/\s+/).at(-1)
    return shorthands[last] ? { key: last, expansion: shorthands[last] } : null
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (draft.trim()) onSend()
    }

    if (e.key === 'Escape') {
      onChange('')
    }

    if (e.key === 'Tab') {
      const suggestions = getSuggestions(draft)
      if (suggestions.length) {
        e.preventDefault()
        acceptSuggestion(suggestions[0])
      }
    }

    if (e.key === ' ') {
      const words = draft.trimEnd().split(/\s+/)
      const last = words.at(-1)
      if (shorthands[last]) {
        e.preventDefault()
        words[words.length - 1] = shorthands[last]
        onChange(words.join(' ') + ' ')
      }
    }
  }

  const suggestions = getSuggestions(draft)
  const shorthandHint = getShorthandHint(draft)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Shorthand Hint */}
      {shorthandHint && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h7M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>
            <strong>'{shorthandHint.key}'</strong> will expand to:{' '}
            <em>{shorthandHint.expansion}</em>
            {' '}— press <kbd className="bg-white border border-amber-200 rounded px-1 font-mono text-amber-600">Space</kbd>
          </span>
        </div>
      )}

      {/* Autocomplete */}
      {suggestions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap px-3 py-2 bg-gray-50 border-b border-gray-200 min-h-10">
          <span className="text-xs text-gray-400 font-medium">Suggestions:</span>
          {suggestions.map((term, i) => (
            <button
              key={term}
              onClick={() => acceptSuggestion(term)}
              className={`px-2.5 py-0.5 rounded-full text-xs border transition-colors ${
                i === 0
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Card */}
      <div className="flex-1 flex flex-col m-5 mb-0 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here…"
          className="flex-1 resize-none border-none outline-none p-5 text-base text-gray-800 leading-relaxed bg-transparent placeholder-gray-300 font-sans"
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span><kbd className="bg-white border border-gray-200 rounded px-1 font-mono">Enter</kbd> Send</span>
            <span><kbd className="bg-white border border-gray-200 rounded px-1 font-mono">Shift+Enter</kbd> New line</span>
            <span><kbd className="bg-white border border-gray-200 rounded px-1 font-mono">Esc</kbd> Clear</span>
          </div>
          <button
            onClick={onSend}
            disabled={!draft.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send
          </button>
        </div>
      </div>

    </div>
  )
}