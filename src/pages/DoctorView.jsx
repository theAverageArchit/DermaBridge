import { useCallback, useState } from 'react'
import TopBar from '../components/doctor/TopBar'
import PhraseLibrary from '../components/doctor/PhraseLibrary'
import ComposeArea from '../components/doctor/ComposeArea'
import HistoryPanel from '../components/doctor/HistoryPanel'
import DiagnosisPopup from '../components/doctor/DiagnosisPopup'
import { useBroadcastChannel } from '../hooks/useBroadcastChannel'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useShorthands } from '../hooks/useShorthands'
import { getDiagnosisSuggestion } from '../services/diagnose'

export default function DoctorView() {

  const [fontsize, setFontsize] = useLocalStorage('db_fontsize', 56)
  const [lang, setLang] = useLocalStorage('db_lang', 'en')
  const [draft, setDraft] = useLocalStorage('db_draft', '')
  const [history, setHistory] = useLocalStorage('db_history', [])
  const [showModal, setShowModal] = useLocalStorage('db_modal', false)
  const [suggestion, setSuggestion] = useState('')
  const [isSuggesting, setIsSuggesting] = useState(false)

  const { shorthands, addShorthand, deleteShorthand, resetToDefaults } = useShorthands()
  const { send } = useBroadcastChannel(() => {})

  const handleFontChange = (size) => {
    const clamped = Math.max(32, Math.min(80, size))
    setFontsize(clamped)
    send({ type: 'font', size: clamped })
  }

  const handleLangChange = (l) => {
    setLang(l)
    send({ type: 'lang', lang: l })
  }

  const handleDraftChange = useCallback((text) => {
    setDraft(text)
    send({ type: 'composing' })
  }, [send, setDraft])

  const handleSend = () => {
    if (!draft.trim()) return
    const text = draft.trim()
    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    })
    send({ type: 'message', text, lang })
    setHistory(prev => [
      { id: Date.now(), text, time },
      ...prev
    ].slice(0, 10))
    setDraft('')
  }

  const reuseMessage = (text) => setDraft(text)

  const handleSuggest = async () => {
    if (!draft.trim() || isSuggesting) return
    setIsSuggesting(true)
    setSuggestion('')
    try {
      const result = await getDiagnosisSuggestion(draft)
      setSuggestion(result)
    } catch (err) {
      console.error('Suggestion error:', err)
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleAcceptSuggestion = (text) => {
    setDraft(text)
    setSuggestion('')
    setIsSuggesting(false)
  }

  const handleDismissSuggestion = () => {
    setSuggestion('')
    setIsSuggesting(false)
  }

  const handleClearSession = () => {
    setHistory([])
    setDraft('')
    send({ type: 'clear' })
    setShowModal(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar
        fontsize={fontsize}
        onFontChange={handleFontChange}
        lang={lang}
        onLangChange={handleLangChange}
        onNewPatient={() => setShowModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <PhraseLibrary
          onSelectPhrase={setDraft}
          shorthands={shorthands}
          addShorthand={addShorthand}
          deleteShorthand={deleteShorthand}
          resetShorthands={resetToDefaults}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <ComposeArea
            draft={draft}
            onChange={handleDraftChange}
            onSend={handleSend}
            shorthands={shorthands}
            onSuggest={handleSuggest}
          />
          <DiagnosisPopup
            suggestion={suggestion}
            isLoading={isSuggesting}
            onAccept={handleAcceptSuggestion}
            onDismiss={handleDismissSuggestion}
          />
          <HistoryPanel
            history={history}
            onReuse={reuseMessage}
          />
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-7 w-80 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 7v4M11 15h.01M21 11a10 10 0 11-20 0 10 10 0 0120 0z" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1.5">Start new patient session?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              This will clear all messages from the patient screen and reset the session. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearSession}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Clear & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}