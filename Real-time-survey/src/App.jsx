import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/Map'
import SurveyPage from './pages/Survey'
import AdminPage from './pages/Admin'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
          <footer className="footer">
            <div>Advantages: Low cost, real-time visualization concept, scalable to IoT.</div>
            <div>Limitations: Simulated data, no physical sensors, limited parameters.</div>
            <div>Future Scope: IoT sensors, cloud database, AI-based prediction.</div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
