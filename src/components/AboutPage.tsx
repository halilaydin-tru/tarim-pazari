export function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Header */}
        <section className="about-header">
          <h1>🌾 Tarım Ticaret Pazarı Hakkında</h1>
          <p>Çiftçilerin doğrudan üreticilerle buluştuğu, modern ve güvenli ticaret platformu</p>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision">
          <div className="mission-card">
            <h2>🎯 Misyonumuz</h2>
            <p>
              Çiftçilerin ürettikleri ürünleri doğrudan, aracı olmadan, en iyi fiyatlarla 
              üreticilere satabilecekleri bir platform oluşturmak. Tarım sektöründe şeffaflığı 
              ve adil ticareti teşvik etmek.
            </p>
          </div>
          <div className="vision-card">
            <h2>🚀 Vizyonumuz</h2>
            <p>
              Türkiye'nin en güvenilir tarım ticaret platformu olmak. Teknoloji aracılığıyla 
              çiftçilerin gelirlerini artırmak ve gıda üreticilerinin ihtiyaçlarını 
              karşılamak.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}        
        <section className="why-choose-us">
          <h2>Neden Tarım Ticaret Pazarı?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h3>Adil Fiyatlandırma</h3>
              <p>Doğrudan alım-satım ile aracısız işlem. En iyi fiyatları alın, en az fiyata satın.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h3>Güvenli İşlem</h3>
              <p>Doğrulanmış satıcılar ve alıcılar. Güvenli ödeme sistemi ve anlaşmazlık çözümü.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <h3>Hızlı İşlemler</h3>
              <p>Anlık bildirim, hızlı uyuşma ve kolay lojistik çözümleri.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🌐</div>
              <h3>Geniş Ağ</h3>
              <p>Binlerce çiftçi ve üretici ile bağlantı kurun. Pazarın her yerinden ürün bulun.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <h3>Kolay Kullanım</h3>
              <p>Mobil ve web uyumlu, kullanımı kolay arayüz. Teknik bilgi gerektirmez.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🤝</div>
              <h3>24/7 Destek</h3>
              <p>Her zaman yardımcı olmak için hazır destek ekibi.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2>Nasıl Çalışır?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Kaydol</h3>
              <p>Çiftçi veya üretici olarak kayıt olun. Basit ve hızlı.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Profili Oluştur</h3>
              <p>Başlık, konum ve iletişim bilgilerinizi girin.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Ürün Ekle/Ara</h3>
              <p>Ürün satın veya satış için platformda işlem yapın.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>İşlem Yapın</h3>
              <p>Doğrudan iletişim kurun, anlaşma sağlayın ve işlemi tamamlayın.</p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="about-stats">
          <h2>Sayılarla Biz</h2>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">2000+</div>
              <div className="stat-text">Memnun Kullanıcı</div>
            </div>
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-text">Aktif Satıcı</div>
            </div>
            <div className="stat">
              <div className="stat-value">150+</div>
              <div className="stat-text">Ürün Çeşidi</div>
            </div>
            <div className="stat">
              <div className="stat-value">₺10M+</div>
              <div className="stat-text">Yıllık İşlem</div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>Bize Ulaşın</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>📧 E-posta</h3>
              <p><a href="mailto:info@tarimticaret.com">info@tarimticaret.com</a></p>
            </div>
            <div className="contact-item">
              <h3>📱 Telefon</h3>
              <p><a href="tel:+905551234567">+90 (555) 123-4567</a></p>
            </div>
            <div className="contact-item">
              <h3>📍 Adres</h3>
              <p>Ankara, Türkiye</p>
            </div>
            <div className="contact-item">
              <h3>⏰ Çalışma Saatleri</h3>
              <p>24/7 Hizmet</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
