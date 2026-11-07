import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import PDFViewer from '../components/PDFViewer'
import DocumentText from '../components/DocumentText'
import useChat from '../hooks/useChat'
import { getDocuments, deleteDocument } from '../services/api'

export default function Chat() {
  const [documents, setDocuments] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [page, setPage] = useState(1)
  const [view, setView] = useState('text') // 'text' | 'pdf'
  const { messages, loading, send, clear } = useChat(activeId)

  useEffect(() => {
    getDocuments()
      .then((res) => {
        setDocuments(res.data)
        if (res.data[0]) setActiveId(res.data[0].id)
      })
      .catch(() => toast.error('Cannot reach the server'))
  }, [])

  const handleUploaded = (doc) => {
    setDocuments((d) => [doc, ...d])
    setActiveId(doc.id)
    setPage(1)
    setView('text') // show the extracted text right after upload
  }

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id)
      localStorage.removeItem(`chat-${id}`)
      const rest = documents.filter((d) => d.id !== id)
      setDocuments(rest)
      if (id === activeId) setActiveId(rest[0]?.id ?? null)
    } catch {
      toast.error('Could not delete the document')
    }
  }

  const tab = (name, label) => (
    <button
      onClick={() => setView(name)}
      className={`flex-1 py-2 text-sm font-medium border-b-2
        ${view === name ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <Sidebar
        documents={documents}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id)
          setPage(1)
        }}
        onDelete={handleDelete}
        onUploaded={handleUploaded}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          hasDoc={!!activeId}
          messages={messages}
          loading={loading}
          onSend={send}
          onClear={clear}
          onPageClick={setPage}
        />
        {activeId && <ChatInput onSend={send} disabled={loading} />}
      </main>

      {activeId && (
        <div className="w-[460px] shrink-0 flex flex-col border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {tab('text', 'Text')}
            {tab('pdf', 'PDF')}
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            {view === 'text' ? (
              <DocumentText docId={activeId} page={page} />
            ) : (
              <PDFViewer docId={activeId} page={page} onPageChange={setPage} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
