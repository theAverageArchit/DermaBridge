export default function DiagnosisPopup({ suggestion, isLoading, onAccept, onDismiss }) {
    if (!isLoading && !suggestion) return null
  
    return (
      <div className="mx-5 mb-0 mt-3 bg-white border border-blue-200 rounded-xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1L8 5h4l-3 2.5 1 4L6.5 9l-3.5 2.5 1-4L1 5h4z" stroke="#2563eb" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-semibold text-blue-700">AI Suggestion</span>
          </div>
          <span className="text-xs text-blue-400">Ctrl+Space to trigger</span>
        </div>
  
        <div className="px-4 py-3">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v2M6 9v2M1 6h2M9 6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xs">Generating suggestion…</span>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
          )}
        </div>
  
        {!isLoading && suggestion && (
          <div className="flex items-center justify-end gap-2 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-white transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => onAccept(suggestion)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 6l3 3 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Accept
            </button>
          </div>
        )}
      </div>
    )
  }