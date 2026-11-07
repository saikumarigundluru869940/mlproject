import { BookOpen } from 'lucide-react'

export default function SourceCitations({ sources, onPageClick }) {
  if (!sources?.length) return null
  return (
    <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-600">
      <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-2">
        <BookOpen size={13} /> Sources
      </p>
      <div className="space-y-2">
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => onPageClick?.(s.page)}
            className="block w-full text-left text-xs p-2 rounded-lg bg-white/60 dark:bg-slate-800 hover:ring-1 hover:ring-indigo-400"
          >
            <span className="font-semibold text-indigo-600">Page {s.page}</span>
            <span className="block text-slate-600 dark:text-slate-400 line-clamp-2">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}