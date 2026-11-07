import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login, register } from '../services/api'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password)
        toast.success('Account created')
      }
      const { data } = await login(form.email, form.password)
      localStorage.setItem('token', data.access_token)
      navigate('/chat')
    } catch (err) {
      const detail = err.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : 'Something went wrong. Check your details.')
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-4">{mode === 'login' ? 'Log in' : 'Create account'}</h2>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input className={input} placeholder="Name" value={form.name} onChange={set('name')} required minLength={2} />
        )}
        <input className={input} type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        <input className={input} type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={set('password')} required minLength={8} />
        <button
          disabled={busy}
          className="w-full p-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-4 text-sm text-indigo-600 hover:underline"
      >
        {mode === 'login' ? "No account? Sign up" : 'Already have an account? Log in'}
      </button>
    </div>
  )
}