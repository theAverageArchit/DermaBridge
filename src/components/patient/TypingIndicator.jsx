export default function TypingIndicator({ visible }) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
        </div>
        <span className="text-sm text-gray-500">Doctor is composing a message…</span>
      </div>
    )
  }