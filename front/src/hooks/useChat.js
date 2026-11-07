import { useEffect, useState } from 'react'
import { sendMessage } from '../services/api'

export default function useChat(docId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const key = `chat-${docId}`

  // load saved chat when the document changes
  useEffect(() => {
    if (!docId) return setMessages([])
    try {
      setMessages(JSON.parse(localStorage.getItem(key)) || [])
    } catch {
      setMessages([])
    }
  }, [docId])

  const save = (msgs) => {
    setMessages(msgs)
    if (docId) localStorage.setItem(key, JSON.stringify(msgs))
  }

  const send = async (text) => {
    if (!text.trim() || !docId || loading) return
    const withUser = [...messages, { role: 'user', content: text }]
    save(withUser)
    setLoading(true)
    try {
      const { data } = await sendMessage(docId, text)
      save([...withUser, { role: 'assistant', content: data.answer, sources: data.sources || [] }])
    } catch {
      save([
        ...withUser,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', sources: [] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clear = () => save([])

  return { messages, loading, send, clear }
}