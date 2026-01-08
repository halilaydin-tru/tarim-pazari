import { useAuth } from '../context/AuthContext'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Hoş Geldiniz, {user?.full_name}! 👋</h1>
            <p>Çiftçilerin doğrudan üreticilerle buluştuğu pazara hoşgeldiniz</p>
            <div className="hero-subtitle">
              <span className="role-badge">
                {user?.role === 'farmer' ? '🌾 Çiftçi Olarak' : '🏭 Üretici Olarak'} Giriş Yaptınız
              </span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Platform Özellikleri</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Geniş Ürün Yelpazesi</h3>
              <p>Tahıldan sebze, meyveye kadar pek çok tarım ürünü bulabilirsiniz</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>En İyi Fiyatlar</h3>
              <p>Doğrudan alım-satım ile en uygun fiyatları alabilirsiniz</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Hızlı İşlem</h3>
              <p>Kolay ve hızlı siparişle ürünlerinize erişebilirsiniz</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Güvenli Alışveriş</h3>
              <p>Doğrulanmış satıcılar ile güvenle işlem yapabilirsiniz</p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-number">150+</div>
            <div className="stat-label">Ürün Çeşidi</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Aktif Satıcı</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2000+</div>
            <div className="stat-label">Memnun Müşteri</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Destek Hizmeti</div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Pazara Hoş Geldiniz!</h2>
            <p>Menüden "Pazarı Keşfet" butonuna tıklayarak tüm ürünleri inceleyebilirsiniz</p>
            {user?.role === 'farmer' && (
              <p className="subtitle">
                Ürün alımı için tüm kategorileri keşfedin ve ihtiyacınız olan ürünleri bulun
              </p>
            )}
            {user?.role === 'producer' && (
              <p className="subtitle">
                Panelimde kendi ürünlerinizi ekleyerek satışa başlayabilirsiniz
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
