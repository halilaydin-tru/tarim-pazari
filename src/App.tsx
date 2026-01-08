import { useState } from 'react'
import { HomePage } from './components/HomePage'
import { ProductMarket } from './components/ProductMarket'
import { SellerDashboard } from './components/SellerDashboard'
import { AboutPage } from './components/AboutPage'
import { UserProfile } from './components/UserProfile'
import { AuthPage } from './components/AuthPage'
import { useAuth } from './context/AuthContext'
import './App.css'
import './styles/HomePage.css'
import './styles/AboutPage.css'
import './styles/UserProfile.css'

function App() {
  const { user, isLoggedIn, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<'home' | 'market' | 'dashboard' | 'about'>('home')
  const [showProfile, setShowProfile] = useState(false)

  if (!isLoggedIn) {
    return <AuthPage />
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h2 className="nav-brand" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>🌾 Tarım Ticaret Pazarı</h2>
          <div className="nav-links">
            <button className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>🏠 Ana Sayfa</button>
            <button className={`nav-btn ${currentPage === 'market' ? 'active' : ''}`} onClick={() => setCurrentPage('market')}>🛍️ Pazarı Keşfet</button>
            <button className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>📊 Panelim</button>
            <button className={`nav-btn ${currentPage === 'about' ? 'active' : ''}`} onClick={() => setCurrentPage('about')}>ℹ️ Hakkında</button>
            <div className="user-menu">
              <button 
                className="user-info-btn"
                onClick={() => setShowProfile(true)}
              >
                <span className="user-name">{user?.full_name}</span>
                <span className="user-role">{user?.role === 'farmer' ? '🌾 Çiftçi' : '🏭 Üretici'}</span>
              </button>
              <button className="btn-logout" onClick={logout}>Çıkış Yap</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'market' && <ProductMarket />}
        {currentPage === 'dashboard' && <SellerDashboard />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Tarım Ticaret Pazarı. Tüm hakları saklıdır.</p>
          <p>Çiftçileri ve üreticileri doğrudan bir araya getiren platform</p>
        </div>
      </footer>
    </div>
  )
}

export default App
