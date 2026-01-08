import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../api/api';
import { ProductDetail } from './ProductDetail';
import '../styles/ProductMarket.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  seller_name: string;
  seller_phone: string;
  category_name: string;
  location: string;
  harvest_date?: string;
  image_url?: string;
}

interface Category {
  id: number;
  name: string;
}

export function ProductMarket() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const response = await productAPI.getProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-market">
      <div className="market-header">
        <h1>🌾 Tarım Pazarı</h1>
        <p>Çiftçilerin ürünlerini doğrudan üreticilere pazarla</p>
      </div>

      <div className="market-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Ürün ara... (örn: domates, buğday)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <button
            className={!selectedCategory ? 'active' : ''}
            onClick={() => setSelectedCategory(null)}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={selectedCategory === cat.id ? 'active' : ''}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Ürünler yükleniyor...</div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>Ürün bulunamadı. Başka arama kriterleri deneyiniz.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => setSelectedProductId(product.id)} style={{ cursor: 'pointer' }}>
              {/* Product Image */}
              {product.image_url && (
                <div className="product-image">
                  <img 
                    src={product.image_url.startsWith('http') ? product.image_url : `https://tarim-pazari-api.onrender.com${product.image_url}`}
                    alt={product.name}
                  />
                </div>
              )}

              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="category-badge">{product.category_name}</span>
              </div>

              <div className="product-body">
                <p className="description">{product.description}</p>
                
                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Fiyat:</span>
                    <span className="value">₺{product.price.toFixed(2)} / {product.unit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Stok:</span>
                    <span className="value">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Satıcı:</span>
                    <span className="value">{product.seller_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Konum:</span>
                    <span className="value">{product.location}</span>
                  </div>
                  {product.harvest_date && (
                    <div className="detail-item">
                      <span className="label">Hasat Tarihi:</span>
                      <span className="value">
                        {new Date(product.harvest_date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="product-footer">
                <button 
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProductId(product.id);
                  }}
                >
                  📋 Detaylı Bilgi & İletişim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProductId && (
        <ProductDetail 
          productId={selectedProductId} 
          onClose={() => setSelectedProductId(null)} 
        />
      )}
    </div>
  );
}
