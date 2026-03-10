import { useEffect, useState } from 'react'

export default function TopBar({ fontsize, onFontChange, lang, onLangChange, onNewPatient }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = String(Math.floor(time / 60)).padStart(2, '0')
  const seconds = String(time % 60).padStart(2, '0')

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">

      {/* Left — Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <span className="font-serif text-lg tracking-tight">DermaBridge</span>
        <div className="w-px h-5 bg-gray-200" />
        <span className="text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          Doctor's View
        </span>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-5">

        {/* Session Timer */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {minutes}:{seconds}
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => onFontChange(fontsize - 4)}
            className="px-2 py-1 rounded text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
          >
            A−
          </button>
          <span className="text-xs text-gray-400 font-mono px-1">{fontsize}px</span>
          <button
            onClick={() => onFontChange(fontsize + 4)}
            className="px-2 py-1 rounded text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
          >
            A+
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => onLangChange('en')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLangChange('hi')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              lang === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* New Patient */}
        <button
          onClick={onNewPatient}
          className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-500 text-xs font-medium px-3 py-1.5 rounded-md hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Patient
        </button>

      </div>
    </header>
  )
}