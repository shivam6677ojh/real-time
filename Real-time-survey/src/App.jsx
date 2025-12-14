import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/Map'
import SurveyPage from './pages/Survey'
import ObservationsPage from './pages/Observations'
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
            <Route path="/observations" element={<ObservationsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
