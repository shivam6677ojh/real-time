import { useEffect, useState } from 'react'
import { WATER_BODIES } from '../data'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'

export default function SurveyPage() {
  const { token } = useAuth()
  const [form, setForm] = useState({ body: WATER_BODIES[0].id, observation: '', pollution: 'Low' })
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const bodyName = WATER_BODIES.find((b) => b.id === form.body)?.name || form.body
      await api('/api/submissions', {
        method: 'POST',
        token,
        body: { bodyId: form.body, bodyName, observation: form.observation, pollution: form.pollution },
      })
      setMessage('Submitted!')
      setForm((f) => ({ ...f, observation: '' }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className="survey">
      <h2>Submit Field Survey</h2>
      {!token && <p style={{ color: '#eab308' }}>Login to submit observations.</p>}
      <form className="survey-form" onSubmit={submit}>
        <label>
          Water Body
          <select value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}>
            {WATER_BODIES.map((wb) => <option key={wb.id} value={wb.id}>{wb.name}</option>)}
          </select>
        </label>
        <label>
          Observations
          <input type="text" placeholder="e.g., foamy water near bridge" value={form.observation} onChange={(e) => setForm({ ...form, observation: e.target.value })} />
        </label>
        <label>
          Pollution Level
          <select value={form.pollution} onChange={(e) => setForm({ ...form, pollution: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <button className="btn" type="submit" disabled={!token}>Submit</button>
      </form>
      {!!message && <p>{message}</p>}
    </section>
  )
}
