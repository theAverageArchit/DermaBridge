import { useState, useEffect } from 'react'
import MessageDisplay from '../components/patient/MessageDisplay'
import TypingIndicator from '../components/patient/TypingIndicator'
import { useBroadcastChannel } from '../hooks/useBroadcastChannel'
import { translateToHindi } from '../services/translate'
import { speak, stopSpeaking } from '../services/tts'

export default function PatientView() {
  const [current, setCurrent] = useState('')
  const [history, setHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [fontsize, setFontsize] = useState(56)
  const [typingResetKey, setTypingResetKey] = useState(0)
  const [isTranslating, setIsTranslating] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)

  // Unlock speech synthesis on first user interaction
  useEffect(() => {
    const unlock = () => {
      const u = new SpeechSynthesisUtterance('')
      window.speechSynthesis.speak(u)
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('click', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const handleMessage = (data) => {
    if (data.type === 'message') {
      setCurrent(prev => {
        if (prev) setHistory(h => [prev, ...h].slice(0, 2))
        return data.text
      })
      setIsTyping(false)

      if (data.lang === 'hi') {
        setIsTranslating(true)
        translateToHindi(data.text)
          .then(translated => {
            setCurrent(translated)
            if (ttsEnabled) speak(translated, 'hi')
          })
          .catch(err => {
            console.error('Translation error:', err)
            if (ttsEnabled) speak(data.text, 'en')
          })
          .finally(() => setIsTranslating(false))
      } else {
        if (ttsEnabled) speak(data.text, 'en')
      }
    }

    if (data.type === 'composing') {
      setIsTyping(true)
      setTypingResetKey(k => k + 1)
    }

    if (data.type === 'clear') {
      setCurrent('')
      setHistory([])
      setIsTyping(false)
      stopSpeaking()
    }

    if (data.type === 'font') {
      setFontsize(data.size)
    }
  }

  useBroadcastChannel(handleMessage)

  useEffect(() => {
    if (!isTyping) return
    const id = setTimeout(() => setIsTyping(false), 3000)
    return () => clearTimeout(id)
  }, [isTyping, typingResetKey])

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">

      <header className="h-13 flex items-center justify-between px-9 border-b border-gray-100 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 6h9M6 1.5v9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.2"/>
            </svg>
          </div>
          <span className="font-serif text-sm text-gray-700">DermaBridge</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (ttsEnabled) stopSpeaking()
              setTtsEnabled(t => !t)
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              ttsEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}
          >
            {ttsEnabled ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 4.5h2l3-3v9l-3-3H1v-3zM8 3.5c1.1.9 1.8 2.2 1.8 3.5S9.1 9.6 8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 4.5h2l3-3v9l-3-3H1v-3zM9 4.5L11 6.5M11 4.5L9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {ttsEnabled ? 'Voice on' : 'Voice off'}
          </button>

          <Clock />
        </div>
      </header>

      <MessageDisplay
        current={current}
        history={history}
        fontsize={fontsize}
      />

      {isTranslating && (
        <div className="fixed bottom-16 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-500 text-xs font-medium px-4 py-2 rounded-full">
            <svg className="animate-spin w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v2M6 9v2M1 6h2M9 6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Translating to Hindi…
          </div>
        </div>
      )}

      <TypingIndicator visible={isTyping} />

    </div>
  )
}

function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true
    }))
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return <span className="text-sm text-gray-400 font-mono">{time}</span>
}