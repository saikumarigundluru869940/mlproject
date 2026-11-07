import { useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

const SUGGESTIONS = [
  'Summarize this document',
  'What are the key points?',
  'List the important dates and numbers',
]

export default function ChatWindow({ messages, loading, onSend, onClear, onPageClick, hasDoc }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (!hasDoc) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Upload or select a PDF to start chatting
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length > 0 && (
        <button
          onClick={onClear}
          className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-red-500"
        >
          <Trash2 size={13} /> Clear chat
        </button>
      )}

      {messages.length === 0 && (
        <div className="text-center mt-16">
          <p className="mb-4 text-slate-500">Ask anything about your document</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onSend(q)}
                className="text-sm px-3 py-2 rounded-full border border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} onPageClick={onPageClick} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}