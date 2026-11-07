import { useEffect, useState } from 'react'
import { getDocumentText } from '../services/api'

export default function DocumentText({ docId, page }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!docId) return
    setData(null)
    setError(false)
    getDocumentText(docId)
      .then((res) => setData(res.data))
      .catch(() => setError(true))
  }, [docId])

  // scroll to the page when a source citation is clicked
  useEffect(() => {
    document.getElementById(`text-page-${page}`)?.scrollIntoView({ behavior: 'smooth' })
  }, [page, data])

  if (error) return <p className="p-4 text-sm text-red-500">Could not load the text.</p>
  if (!data) return <p className="p-4 text-sm text-slate-500">Loading text...</p>

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      <h3 className="font-semibold text-sm truncate">{data.name}</h3>
      {data.pages.map((p) => (
        <section
          key={p.page}
          id={`text-page-${p.page}`}
          className={`rounded-xl p-3 border text-sm whitespace-pre-wrap
            ${p.page === page ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-700'}`}
        >
          <p className="text-xs font-semibold text-indigo-600 mb-1">Page {p.page}</p>
          {p.text || <span className="text-slate-500">(no text on this page)</span>}
        </section>
      ))}
    </div>
  )
}