import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI, categoryAPI } from '../api/api';
import '../styles/Dashboard.css';

interface Category {
  id: number;
  name: string;
}

export function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category_id: '',
    location: user?.location || '',
    harvest_date: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, category_id: response.data[0].id }));
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts({ seller_id: user?.id });
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('quantity', formData.quantity);
      formDataObj.append('unit', formData.unit);
      formDataObj.append('category_id', formData.category_id);
      formDataObj.append('seller_id', user?.id?.toString() || '');
      formDataObj.append('location', formData.location);
      if (formData.harvest_date) {
        formDataObj.append('harvest_date', formData.harvest_date);
      }
      if (selectedFile) {
        formDataObj.append('image', selectedFile);
      }

      await productAPI.createProduct(formDataObj);
      setMessage('✅ Ürün başarıyla eklendi!');
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: 'kg',
        category_id: categories[0]?.id?.toString() || '',
        location: user?.location || '',
        harvest_date: '',
      });
      setImagePreview(null);
      setSelectedFile(null);
      loadProducts();
    } catch (error: any) {
      setMessage('❌ ' + (error.response?.data?.error || 'Ürün eklenmesi başarısız'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await productAPI.deleteProduct(productId);
        setMessage('✅ Ürün silindi');
        loadProducts();
      } catch (error) {
        setMessage('❌ Ürün silinirken hata oluştu');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>📦 Satıcı Paneli</h1>
        <p>Merhaba, {user?.full_name}! Buradan ürünlerinizi yönetebilirsiniz.</p>

        <div className="dashboard-grid">
          {/* Ürün Ekleme Formu */}
          <div className="dashboard-section">
            <h2>Yeni Ürün Ekle</h2>
            {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Ürün Adı *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="örn: Taze Domates"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Ürün hakkında detaylı bilgi..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Ürün Fotoğrafı</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category_id">Kategori *</label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Fiyat (₺) *</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Miktar *</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Birim *</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="ton">Ton</option>
                    <option value="litre">Litre</option>
                    <option value="adet">Adet</option>
                    <option value="koli">Koli</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Konum</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder={user?.location || 'Şehir/İlçe'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="harvest_date">Hasat Tarihi</label>
                  <input
                    id="harvest_date"
                    type="date"
                    name="harvest_date"
                    value={formData.harvest_date}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Ekleniyor...' : '✅ Ürün Ekle'}
              </button>
            </form>
          </div>

          {/* Ürün Listesi */}
          <div className="dashboard-section">
            <h2>Satılık Ürünlerim ({products.length})</h2>
            
            {products.length === 0 ? (
              <p className="no-products">Henüz ürün eklemediniz.</p>
            ) : (
              <div className="products-list">
                {products.map(product => (
                  <div key={product.id} className="product-item">
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="category">{product.category_name}</p>
                      <p className="price">₺{product.price} / {product.unit}</p>
                      <p className="quantity">Stok: {product.quantity} {product.unit}</p>
                      {product.location && <p className="location">📍 {product.location}</p>}
                    </div>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={loading}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
