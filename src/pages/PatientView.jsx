import { useState, useEffect } from 'react'
import MessageDisplay from '../components/patient/MessageDisplay'
import TypingIndicator from '../components/patient/TypingIndicator'
import { useBroadcastChannel } from '../hooks/useBroadcastChannel'

export default function PatientView() {
  const [current, setCurrent] = useState('')
  const [history, setHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [fontsize, setFontsize] = useState(56)
  const [typingResetKey, setTypingResetKey] = useState(0)

  const handleMessage = (data) => {
    if (data.type === 'message') {
      setCurrent(prev => {
        if (prev) setHistory(h => [prev, ...h].slice(0, 2))
        return data.text
      })
      setIsTyping(false)
    }

    if (data.type === 'composing') {
      setIsTyping(true)
      setTypingResetKey(k => k + 1)
    }

    if (data.type === 'clear') {
      setCurrent('')
      setHistory([])
      setIsTyping(false)
    }

    if (data.type === 'font') {
      setFontsize(data.size)
    }
  }

  useBroadcastChannel(handleMessage)

  // Auto-hide typing indicator after 3s; reset timer on each new composing
  useEffect(() => {
    if (!isTyping) return
    const id = setTimeout(() => setIsTyping(false), 3000)
    return () => clearTimeout(id)
  }, [isTyping, typingResetKey])

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">

      {/* Subtle top bar */}
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
        <Clock />
      </header>

      {/* Message area */}
      <MessageDisplay
        current={current}
        history={history}
        fontsize={fontsize}
      />

      {/* Typing indicator */}
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