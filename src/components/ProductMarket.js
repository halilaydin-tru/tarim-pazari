import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../api/api';
import { ProductDetail } from './ProductDetail';
import '../styles/ProductMarket.css';
export function ProductMarket() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);
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
        }
        catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };
    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedCategory)
                params.category_id = selectedCategory;
            if (searchTerm)
                params.search = searchTerm;
            const response = await productAPI.getProducts(params);
            setProducts(response.data);
        }
        catch (error) {
            console.error('Ürünler yüklenemedi:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "product-market", children: [_jsxs("div", { className: "market-header", children: [_jsx("h1", { children: "\uD83C\uDF3E Tar\u0131m Pazar\u0131" }), _jsx("p", { children: "\u00C7ift\u00E7ilerin \u00FCr\u00FCnlerini do\u011Frudan \u00FCreticilere pazarla" })] }), _jsxs("div", { className: "market-controls", children: [_jsx("div", { className: "search-box", children: _jsx("input", { type: "text", placeholder: "\u00DCr\u00FCn ara... (\u00F6rn: domates, bu\u011Fday)", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsxs("div", { className: "category-filter", children: [_jsx("button", { className: !selectedCategory ? 'active' : '', onClick: () => setSelectedCategory(null), children: "T\u00FCm\u00FC" }), categories.map((cat) => (_jsx("button", { className: selectedCategory === cat.id ? 'active' : '', onClick: () => setSelectedCategory(cat.id), children: cat.name }, cat.id)))] })] }), loading ? (_jsx("div", { className: "loading", children: "\u00DCr\u00FCnler y\u00FCkleniyor..." })) : products.length === 0 ? (_jsx("div", { className: "no-products", children: _jsx("p", { children: "\u00DCr\u00FCn bulunamad\u0131. Ba\u015Fka arama kriterleri deneyiniz." }) })) : (_jsx("div", { className: "products-grid", children: products.map((product) => (_jsxs("div", { className: "product-card", onClick: () => setSelectedProductId(product.id), style: { cursor: 'pointer' }, children: [_jsxs("div", { className: "product-header", children: [_jsx("h3", { children: product.name }), _jsx("span", { className: "category-badge", children: product.category_name })] }), _jsxs("div", { className: "product-body", children: [_jsx("p", { className: "description", children: product.description }), _jsxs("div", { className: "product-details", children: [_jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "label", children: "Fiyat:" }), _jsxs("span", { className: "value", children: ["\u20BA", product.price.toFixed(2), " / ", product.unit] })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "label", children: "Stok:" }), _jsxs("span", { className: "value", children: [product.quantity, " ", product.unit] })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "label", children: "Sat\u0131c\u0131:" }), _jsx("span", { className: "value", children: product.seller_name })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "label", children: "Konum:" }), _jsx("span", { className: "value", children: product.location })] }), product.harvest_date && (_jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "label", children: "Hasat Tarihi:" }), _jsx("span", { className: "value", children: new Date(product.harvest_date).toLocaleDateString('tr-TR') })] }))] })] }), _jsx("div", { className: "product-footer", children: _jsx("button", { className: "btn-primary", onClick: (e) => {
                                    e.stopPropagation();
                                    setSelectedProductId(product.id);
                                }, children: "\uD83D\uDCCB Detayl\u0131 Bilgi & \u0130leti\u015Fim" }) })] }, product.id))) })), selectedProductId && (_jsx(ProductDetail, { productId: selectedProductId, onClose: () => setSelectedProductId(null) }))] }));
}
