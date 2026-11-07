import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadPdf } from '../services/api'

export default function FileUpload({ onUploaded }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // idle | uploading | processing

  const onDrop = useCallback(
    async (accepted, rejected) => {
      if (rejected.length) return toast.error('Only PDF files up to 20 MB are allowed')
      const file = accepted[0]
      if (!file) return
      try {
        setStatus('uploading')
        setProgress(0)
        const { data } = await uploadPdf(file, (p) => {
          setProgress(p)
          if (p === 100) setStatus('processing')
        })
        onUploaded(data) // expected: { id, name }
        toast.success('Document ready!')
      } catch {
        toast.error('Upload failed. Is the backend running?')
      } finally {
        setStatus('idle')
      }
    },
    [onUploaded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: status !== 'idle',
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition
        ${isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}`}
    >
      <input {...getInputProps()} />
      {status === 'idle' ? (
        <>
          <UploadCloud className="mx-auto mb-1 text-indigo-600" />
          <p className="text-sm">{isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF, or click'}</p>
          <p className="text-xs text-slate-500">Max 20 MB</p>
        </>
      ) : (
        <div className="space-y-2">
          <Loader2 className="mx-auto animate-spin text-indigo-600" />
          <p className="text-sm">
            {status === 'uploading' ? `Uploading ${progress}%` : 'Processing document...'}
          </p>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded">
            <div
              className="h-full bg-indigo-600 rounded transition-all"
              style={{ width: status === 'processing' ? '100%' : `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}