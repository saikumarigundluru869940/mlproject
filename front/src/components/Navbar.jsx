import { Link } from 'react-router-dom'
import { FileText, Moon, Sun } from 'lucide-react'

export default function Navbar({ dark, toggle }) {
  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <FileText className="text-indigo-600" />
        PDF<span className="text-indigo-600">Chat</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/chat" className="text-sm font-medium hover:text-indigo-600">
          Open App
        </Link>
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  )
}