import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const { setToken, setUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api('/api/auth/signup', { method: 'POST', body: { name, email, password } })
      setToken(res.token); setUser(res.user)
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="centered">
      <div className="card-narrow">
        <section className="panel">
          <h2>Signup</h2>
          <form className="survey-form" onSubmit={submit}>
            <label>Name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></label>
            <button className="btn" type="submit">Create account</button>
          </form>
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        </section>
      </div>
    </div>
  )
}
