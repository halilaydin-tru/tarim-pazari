import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../api/api'
import '../styles/UserProfile.css'

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    location: user?.location || '',
    phone: user?.phone || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await userAPI.updateUser(user?.id || 0, formData)
      updateUser(response.data)
      setSuccess('Profil başarıyla güncellendi!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Güncelleme başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-profile-modal">
      <div className="profile-overlay" onClick={onClose}></div>
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profil Bilgileri</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Ad Soyad:</label>
            <span>{user?.full_name}</span>
          </div>
          <div className="info-item">
            <label>E-posta:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <label>Rol:</label>
            <span className="role-badge">
              {user?.role === 'farmer' ? '🌾 Çiftçi' : '🏭 Üretici'}
            </span>
          </div>
          <div className="info-item">
            <label>Konum:</label>
            <span>{user?.location || '-'}</span>
          </div>
          <div className="info-item">
            <label>Telefon:</label>
            <span>{user?.phone || '-'}</span>
          </div>
        </div>

        {!isEditing ? (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            ✏️ Bilgileri Düzenle
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="full_name">Ad Soyad</label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Konum</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Şehir adını girin"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefon</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+90 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Kaydediliyor...' : '💾 Kaydet'}
              </button>
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    full_name: user?.full_name || '',
                    email: user?.email || '',
                    location: user?.location || '',
                    phone: user?.phone || '',
                  })
                }}
                disabled={loading}
              >
                İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
