import { useMemo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const API = import.meta.env.VITE_API_URL || ''

export default function PDFViewer({ docId, page, onPageChange }) {
  const [numPages, setNumPages] = useState(0)

  // sends the login token when react-pdf downloads the PDF
  const fileProp = useMemo(
    () => ({
      url: `${API}/api/documents/${docId}/file`,
      httpHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
    [docId]
  )

  if (!docId) return null

  return (
    <div className="w-[460px] shrink-0 flex flex-col bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 text-sm">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="disabled:opacity-30"
        >
          <ChevronLeft />
        </button>
        <span>
          Page {page} / {numPages || '-'}
        </span>
        <button
          onClick={() => onPageChange(Math.min(numPages, page + 1))}
          disabled={page >= numPages}
          className="disabled:opacity-30"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 flex justify-center">
        <Document
          file={fileProp}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="text-sm text-slate-500">Loading PDF...</p>}
          error={<p className="text-sm text-red-500">Could not load the PDF.</p>}
        >
          <Page pageNumber={page} width={420} />
        </Document>
      </div>
    </div>
  )
}