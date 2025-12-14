import { useState } from 'react'

export default function SurveyForm({ bodies }) {
  const [form, setForm] = useState({ body: bodies[0]?.id || '', observation: '', pollution: 'Low' })
  const [logs, setLogs] = useState([])

  const submit = (e) => {
    e.preventDefault()
    const bodyName = bodies.find((b) => b.id === form.body)?.name || form.body
    setLogs((prev) => [{ id: Date.now(), ...form, bodyName }, ...prev])
    setForm((f) => ({ ...f, observation: '' }))
  }

  return (
    <div className="survey-grid">
      <form className="survey-form" onSubmit={submit}>
        <label>
          Water Body
          <select value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}>
            {bodies.map((wb) => (
              <option key={wb.id} value={wb.id}>{wb.name}</option>
            ))}
          </select>
        </label>
        <label>
          Observations
          <input
            type="text"
            placeholder="e.g., foamy water near bridge"
            value={form.observation}
            onChange={(e) => setForm({ ...form, observation: e.target.value })}
          />
        </label>
        <label>
          Pollution Level
          <select value={form.pollution} onChange={(e) => setForm({ ...form, pollution: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <button type="submit" className="btn">Submit Observation</button>
      </form>
      <div className="survey-log">
        <h3>Recent Observations</h3>
        {logs.length === 0 ? (
          <p>No observations yet.</p>
        ) : (
          <ul>
            {logs.map((l) => (
              <li key={l.id}>
                <strong>{l.bodyName}</strong> — {l.observation || 'No details'} — {l.pollution}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
