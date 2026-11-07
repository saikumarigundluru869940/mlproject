import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  const submit = () => {
    if (!text.trim() || disabled) return
    onSend(text)
    setText('')
  }

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-end gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Ask a question about your document..."
          className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="p-3 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700"
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-1">Enter to send, Shift + Enter for a new line</p>
    </div>
  )
}