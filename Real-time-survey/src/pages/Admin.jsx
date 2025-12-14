import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'

export default function AdminPage() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await api('/api/submissions', { token })
        if (mounted) setItems(data)
      } catch (e) {
        setError(e.message)
      }
    }
    if (token) load()
    return () => { mounted = false }
  }, [token])

  return (
    <section>
      <h2>Admin - Submissions</h2>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!items.length ? <p>No submissions yet.</p> : (
        <ul>
          {items.map((s) => (
            <li key={s._id}>
              <strong>{s.bodyName || s.bodyId}</strong> — {s.pollution} — {s.observation || 'No details'}
              <span style={{ color: '#9ca3af' }}> ({new Date(s.createdAt).toLocaleString()})</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
