import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'

export default function Observations() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api('/api/submissions', { token })
        setItems(res)
      } catch (e) {
        setError(e.message || 'Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-header">
          <h2>Recent Observations</h2>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{color:'#fca5a5'}}>{error}</p>}
        {!loading && !error && (
          <div className="survey-log">
            {items.length === 0 ? (
              <p>No observations yet. Submit from the Survey page.</p>
            ) : (
              <ul>
                {items.map((it) => (
                  <li key={it._id}>
                    <strong>{it.waterBody}</strong> — pH {it.ph}, Turbidity {it.turbidity} NTU — {new Date(it.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
