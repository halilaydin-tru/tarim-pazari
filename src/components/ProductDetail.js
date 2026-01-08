import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { productAPI } from '../api/api';
import '../styles/ProductDetail.css';
export function ProductDetail({ productId, onClose }) {
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productAPI.getProductById(productId);
                setProduct(response.data);
                // Seller bilgilerini al (frontend'te sakladığımız için basit bir demo)
                setSeller({
                    id: response.data.seller_id,
                    full_name: response.data.seller_name || 'Satıcı Bilgisi Yok',
                    role: response.data.seller_role || 'Çiftçi',
                    phone: response.data.seller_phone || '-',
                    location: response.data.location || '-',
                    email: response.data.seller_email || '-'
                });
            }
            catch (err) {
                setError('Ürün yüklenemedi');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);
    if (loading) {
        return (_jsxs("div", { className: "product-detail-modal", children: [_jsx("div", { className: "detail-overlay", onClick: onClose }), _jsx("div", { className: "detail-card", children: _jsx("div", { children: "Y\u00FCkleniyor..." }) })] }));
    }
    if (error || !product) {
        return (_jsxs("div", { className: "product-detail-modal", children: [_jsx("div", { className: "detail-overlay", onClick: onClose }), _jsxs("div", { className: "detail-card", children: [_jsx("div", { className: "error-message", children: error || 'Ürün bulunamadı' }), _jsx("button", { onClick: onClose, className: "close-detail-btn", children: "Kapat" })] })] }));
    }
    return (_jsxs("div", { className: "product-detail-modal", children: [_jsx("div", { className: "detail-overlay", onClick: onClose }), _jsxs("div", { className: "detail-card", children: [_jsx("button", { className: "close-btn", onClick: onClose, children: "\u2715" }), _jsxs("div", { className: "detail-content", children: [_jsxs("section", { className: "product-section", children: [_jsx("h2", { children: product.name }), _jsx("p", { className: "product-description", children: product.description }), _jsxs("div", { className: "product-specs", children: [_jsxs("div", { className: "spec-item", children: [_jsx("label", { children: "Fiyat:" }), _jsxs("span", { className: "spec-price", children: ["\u20BA", product.price.toFixed(2), "/kg"] })] }), _jsxs("div", { className: "spec-item", children: [_jsx("label", { children: "Mevcut Stok:" }), _jsxs("span", { children: [product.quantity, " ", product.unit] })] }), _jsxs("div", { className: "spec-item", children: [_jsx("label", { children: "Kategori:" }), _jsx("span", { className: "category-tag", children: product.category_id })] }), _jsxs("div", { className: "spec-item", children: [_jsx("label", { children: "Hasat Tarihi:" }), _jsx("span", { children: new Date(product.harvest_date).toLocaleDateString('tr-TR') })] }), _jsxs("div", { className: "spec-item", children: [_jsx("label", { children: "Konum:" }), _jsxs("span", { children: ["\uD83D\uDCCD ", product.location] })] })] })] }), _jsxs("section", { className: "seller-section", children: [_jsx("h3", { children: "Sat\u0131c\u0131 Bilgileri" }), _jsxs("div", { className: "seller-card", children: [_jsx("div", { className: "seller-header", children: _jsxs("div", { className: "seller-name", children: [_jsx("h4", { children: seller?.full_name }), _jsx("span", { className: "seller-role", children: seller?.role === 'farmer' ? '🌾 Çiftçi' : '🏭 Üretici' })] }) }), _jsxs("div", { className: "seller-details", children: [_jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "\uD83D\uDCF1 Telefon:" }), _jsx("a", { href: `tel:${seller?.phone}`, className: "contact-link", children: seller?.phone })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "\uD83D\uDCE7 E-posta:" }), _jsx("a", { href: `mailto:${seller?.email}`, className: "contact-link", children: seller?.email })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "\uD83D\uDCCD Konum:" }), _jsx("span", { children: seller?.location })] })] }), _jsx("div", { className: "seller-note", children: _jsxs("p", { children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Sat\u0131c\u0131 ile ileti\u015Fim kurun:" }), " \u00DCr\u00FCn detaylar\u0131 hakk\u0131nda daha fazla bilgi almak ve fiyat \u00FCzerinde anla\u015Fmak i\u00E7in sat\u0131c\u0131yla do\u011Frudan telefonda konu\u015Fman\u0131z \u00F6nerilir."] }) })] })] })] }), _jsx("div", { className: "detail-footer", children: _jsx("button", { onClick: onClose, className: "btn-close", children: "Kapat" }) })] })] }));
}
