export default function HistoryPanel({ history }) {
    if (!history.length) return null
  
    return (
      <div className="mx-5 mb-5 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm shrink-0">
  
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            Sent this session
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {history.length} message{history.length !== 1 ? 's' : ''}
          </span>
        </div>
  
        {/* Messages */}
        <div className="flex flex-col-reverse max-h-36 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer group transition-colors"
              onClick={() => item.onReuse(item.text)}
            >
              <span className="text-xs text-gray-500 truncate group-hover:text-blue-600 transition-colors">
                {item.text}
              </span>
              <span className="text-xs text-gray-300 font-mono shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
  
      </div>
    )
  }