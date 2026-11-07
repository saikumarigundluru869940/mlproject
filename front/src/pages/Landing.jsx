import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Cpu, MessageSquare } from 'lucide-react'

const steps = [
  { icon: Upload, title: 'Upload', text: 'Drop in any PDF document.' },
  { icon: Cpu, title: 'Process', text: 'The AI reads and indexes the content.' },
  { icon: MessageSquare, title: 'Ask', text: 'Get answers with page citations.' },
]

export default function Landing() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-4"
      >
        Chat with your <span className="text-indigo-600">PDFs</span>
      </motion.h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
        Upload a document, ask questions, and get instant answers with sources.
      </p>
      <Link
        to="/chat"
        className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
      >
        Get Started
      </Link>

      <div className="grid md:grid-cols-3 gap-6 mt-20">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <Icon className="mx-auto mb-3 text-indigo-600" size={32} />
            <h3 className="font-semibold mb-1">{`${i + 1}. ${title}`}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}