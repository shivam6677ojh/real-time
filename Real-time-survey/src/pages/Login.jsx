import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { setToken, setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api('/api/auth/login', { method: 'POST', body: { email, password } })
      setToken(res.token); setUser(res.user)
      navigate('/')
    } catch (e) {
      setError(e.message)
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
  }

  return (
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      <h2>Login</h2>
      <form className="survey-form" onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn" type="submit">Login</button>
      </form>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
    </section>
  )
}
