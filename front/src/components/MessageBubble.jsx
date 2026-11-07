import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import SourceCitations from './SourceCitations'

export default function MessageBubble({ message, onPageClick }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm
          ${isUser ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {!isUser && (
          <>
            <SourceCitations sources={message.sources} onPageClick={onPageClick} />
            <button
              onClick={copy}
              className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}