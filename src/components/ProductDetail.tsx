import { useEffect, useState } from 'react'
import { productAPI } from '../api/api'
import '../styles/ProductDetail.css'

interface ProductDetailProps {
  productId: number
  onClose: () => void
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  unit: string
  category_id: number
  category_name?: string
  harvest_date: string
  seller_id: number
  location: string
  image_url?: string
}

interface Seller {
  id: number
  full_name: string
  role: string
  phone: string
  location: string
  email: string
}

export function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productAPI.getProductById(productId)
        setProduct(response.data)
        
        // Seller bilgilerini al (frontend'te sakladığımız için basit bir demo)
        setSeller({
          id: response.data.seller_id,
          full_name: response.data.seller_name || 'Satıcı Bilgisi Yok',
          role: response.data.seller_role || 'Çiftçi',
          phone: response.data.seller_phone || '-',
          location: response.data.location || '-',
          email: response.data.seller_email || '-'
        })
      } catch (err: any) {
        setError('Ürün yüklenemedi')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="product-detail-modal">
        <div className="detail-overlay" onClick={onClose}></div>
        <div className="detail-card">
          <div>Yükleniyor...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-modal">
        <div className="detail-overlay" onClick={onClose}></div>
        <div className="detail-card">
          <div className="error-message">{error || 'Ürün bulunamadı'}</div>
          <button onClick={onClose} className="close-detail-btn">Kapat</button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-modal">
      <div className="detail-overlay" onClick={onClose}></div>
      <div className="detail-card">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="detail-content">
          {/* Product Image */}
          {product.image_url && (
            <div className="product-image-container">
              <img 
                src={product.image_url.startsWith('http') ? product.image_url : `https://tarim-pazari-api.onrender.com${product.image_url}`} 
                alt={product.name}
                className="product-detail-image"
              />
            </div>
          )}

          {/* Product Info */}
          <section className="product-section">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>

            <div className="product-specs">
              <div className="spec-item">
                <label>Fiyat:</label>
                <span className="spec-price">₺{product.price.toFixed(2)}/kg</span>
              </div>
              <div className="spec-item">
                <label>Mevcut Stok:</label>
                <span>{product.quantity} {product.unit}</span>
              </div>
              <div className="spec-item">
                <label>Kategori:</label>
                <span className="category-tag">{product.category_id}</span>
              </div>
              <div className="spec-item">
                <label>Hasat Tarihi:</label>
                <span>{new Date(product.harvest_date).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="spec-item">
                <label>Konum:</label>
                <span>📍 {product.location}</span>
              </div>
            </div>
          </section>

          {/* Seller Info */}
          <section className="seller-section">
            <h3>Satıcı Bilgileri</h3>
            <div className="seller-card">
              <div className="seller-header">
                <div className="seller-name">
                  <h4>{seller?.full_name}</h4>
                  <span className="seller-role">
                    {seller?.role === 'farmer' ? '🌾 Çiftçi' : '🏭 Üretici'}
                  </span>
                </div>
              </div>

              <div className="seller-details">
                <div className="detail-row">
                  <span className="label">📱 Telefon:</span>
                  <a href={`tel:${seller?.phone}`} className="contact-link">
                    {seller?.phone}
                  </a>
                </div>
                <div className="detail-row">
                  <span className="label">📧 E-posta:</span>
                  <a href={`mailto:${seller?.email}`} className="contact-link">
                    {seller?.email}
                  </a>
                </div>
                <div className="detail-row">
                  <span className="label">📍 Konum:</span>
                  <span>{seller?.location}</span>
                </div>
              </div>

              <div className="seller-note">
                <p>💡 <strong>Satıcı ile iletişim kurun:</strong> Ürün detayları hakkında daha fazla bilgi almak ve fiyat üzerinde anlaşmak için satıcıyla doğrudan telefonda konuşmanız önerilir.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-footer">
          <button onClick={onClose} className="btn-close">Kapat</button>
        </div>
      </div>
    </div>
  )
}
