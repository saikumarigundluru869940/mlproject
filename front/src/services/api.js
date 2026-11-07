import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password })

export const login = (email, password) =>
  api.post('/auth/login', new URLSearchParams({ username: email, password }))

export const uploadPdf = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  })
}

export const sendMessage = (documentId, question) =>
  api.post('/chat', { document_id: documentId, question })

export const getDocuments = () => api.get('/documents')
export const getDocumentText = (id) => api.get(`/documents/${id}/text`)

export const deleteDocument = (id) => api.delete(`/documents/${id}`)