import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="header header-glass">
      <div className="brand">
        <span className="brand-dot" />
        <h1 className="brand-title"><Link to="/">Delhi Water Monitor</Link></h1>
      </div>
      <nav className="nav">
        <NavLink to="/" end className="nav-link">Dashboard</NavLink>
        <NavLink to="/map" className="nav-link">Map</NavLink>
        <NavLink to="/survey" className="nav-link">Survey</NavLink>
          <NavLink to="/observations" className="nav-link">Observations</NavLink>
          {user ? (
            <div className="userbox">
              <div className="avatar" aria-hidden>{(user.name || user.email || 'U').slice(0,1).toUpperCase()}</div>
              <span className="username">{user.name || user.email}</span>
              <button className="btn btn-small" onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/signup" className="nav-link">Signup</NavLink>
            </>
          )}
      </nav>
    </header>
  )
}
