import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="header">
      <h1 style={{ margin: 0, fontSize: '1.2rem' }}><Link to="/">Delhi Water Monitor</Link></h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/map">Map</NavLink>
        <NavLink to="/survey">Survey</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        {user ? (
          <button className="btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
