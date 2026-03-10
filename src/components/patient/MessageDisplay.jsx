import { useEffect, useRef } from 'react'

export default function MessageDisplay({ current, history, fontsize }) {
  const messageRef = useRef(null)

  useEffect(() => {
    if (!messageRef.current || !current) return
    messageRef.current.classList.remove('animate-message-in')
    void messageRef.current.offsetWidth // force reflow
    messageRef.current.classList.add('animate-message-in')
  }, [current])

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto px-16 gap-6">

      {/* History */}
      {history.length > 0 && (
        <div className="flex flex-col items-center gap-2 w-full">
          {history.map((msg, i) => (
            <p
              key={i}
              className={`text-center leading-relaxed transition-all duration-500 ${
                i === 0
                  ? 'text-xl text-gray-400 font-serif'
                  : 'text-lg text-gray-300 font-serif'
              }`}
            >
              {msg}
            </p>
          ))}
          <div className="w-8 h-px bg-gray-200 mt-1" />
        </div>
      )}

      {/* Current message */}
      <div ref={messageRef} className="text-center w-full animate-message-in">
        {current ? (
          <p
            className="font-serif font-medium text-gray-900 leading-snug tracking-tight"
            style={{ fontSize: `${fontsize}px` }}
          >
            {current}
          </p>
        ) : (
          <p className="font-serif text-4xl text-gray-200 italic">
            Waiting for doctor…
          </p>
        )}
      </div>

    </div>
  )
}