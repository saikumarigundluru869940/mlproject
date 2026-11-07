import { FileText, Trash2 } from 'lucide-react'
import FileUpload from './FileUpload'

export default function Sidebar({ documents, activeId, onSelect, onDelete, onUploaded }) {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
      <FileUpload onUploaded={onUploaded} />

      <div>
        <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">Your Documents</h3>
        {documents.length === 0 && <p className="text-sm text-slate-500">No documents yet.</p>}
        <ul className="space-y-1">
          {documents.map((doc) => (
            <li
              key={doc.id}
              onClick={() => onSelect(doc.id)}
              className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm
                ${doc.id === activeId ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <FileText size={16} className="shrink-0" />
              <span className="truncate flex-1">{doc.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(doc.id)
                }}
                className="opacity-0 group-hover:opacity-100 text-red-500"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}