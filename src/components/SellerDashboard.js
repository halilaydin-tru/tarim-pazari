import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI, categoryAPI } from '../api/api';
import '../styles/Dashboard.css';
export function SellerDashboard() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
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
        }
        catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };
    const loadProducts = async () => {
        try {
            const response = await productAPI.getProducts({ seller_id: user?.id });
            setProducts(response.data);
        }
        catch (error) {
            console.error('Ürünler yüklenemedi:', error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            setMessage('❌ ' + (error.response?.data?.error || 'Ürün eklenmesi başarısız'));
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteProduct = async (productId) => {
        if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                await productAPI.deleteProduct(productId);
                setMessage('✅ Ürün silindi');
                loadProducts();
            }
            catch (error) {
                setMessage('❌ Ürün silinirken hata oluştu');
            }
        }
    };
    return (_jsx("div", { className: "dashboard", children: _jsxs("div", { className: "dashboard-container", children: [_jsx("h1", { children: "\uD83D\uDCE6 Sat\u0131c\u0131 Paneli" }), _jsxs("p", { children: ["Merhaba, ", user?.full_name, "! Buradan \u00FCr\u00FCnlerinizi y\u00F6netebilirsiniz."] }), _jsxs("div", { className: "dashboard-grid", children: [_jsxs("div", { className: "dashboard-section", children: [_jsx("h2", { children: "Yeni \u00DCr\u00FCn Ekle" }), message && _jsx("div", { className: `message ${message.includes('✅') ? 'success' : 'error'}`, children: message }), _jsxs("form", { className: "product-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "\u00DCr\u00FCn Ad\u0131 *" }), _jsx("input", { id: "name", type: "text", name: "name", value: formData.name, onChange: handleInputChange, required: true, disabled: loading, placeholder: "\u00F6rn: Taze Domates" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "description", children: "A\u00E7\u0131klama" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleInputChange, disabled: loading, placeholder: "\u00DCr\u00FCn hakk\u0131nda detayl\u0131 bilgi...", rows: 3 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "image", children: "\u00DCr\u00FCn Foto\u011Fraf\u0131" }), _jsx("input", { id: "image", type: "file", accept: "image/*", onChange: handleImageChange, disabled: loading }), imagePreview && (_jsx("div", { style: { marginTop: '10px' }, children: _jsx("img", { src: imagePreview, alt: "Preview", style: { maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' } }) }))] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "category_id", children: "Kategori *" }), _jsx("select", { id: "category_id", name: "category_id", value: formData.category_id, onChange: handleInputChange, required: true, disabled: loading, children: categories.map(cat => (_jsx("option", { value: cat.id, children: cat.name }, cat.id))) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "price", children: "Fiyat (\u20BA) *" }), _jsx("input", { id: "price", type: "number", name: "price", value: formData.price, onChange: handleInputChange, required: true, disabled: loading, step: "0.01", placeholder: "0.00" })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "quantity", children: "Miktar *" }), _jsx("input", { id: "quantity", type: "number", name: "quantity", value: formData.quantity, onChange: handleInputChange, required: true, disabled: loading, step: "0.01" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "unit", children: "Birim *" }), _jsxs("select", { id: "unit", name: "unit", value: formData.unit, onChange: handleInputChange, required: true, disabled: loading, children: [_jsx("option", { value: "kg", children: "Kilogram (kg)" }), _jsx("option", { value: "ton", children: "Ton" }), _jsx("option", { value: "litre", children: "Litre" }), _jsx("option", { value: "adet", children: "Adet" }), _jsx("option", { value: "koli", children: "Koli" })] })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "location", children: "Konum" }), _jsx("input", { id: "location", type: "text", name: "location", value: formData.location, onChange: handleInputChange, disabled: loading, placeholder: user?.location || 'Şehir/İlçe' })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "harvest_date", children: "Hasat Tarihi" }), _jsx("input", { id: "harvest_date", type: "date", name: "harvest_date", value: formData.harvest_date, onChange: handleInputChange, disabled: loading })] })] }), _jsx("button", { type: "submit", className: "btn-submit", disabled: loading, children: loading ? 'Ekleniyor...' : '✅ Ürün Ekle' })] })] }), _jsxs("div", { className: "dashboard-section", children: [_jsxs("h2", { children: ["Sat\u0131l\u0131k \u00DCr\u00FCnlerim (", products.length, ")"] }), products.length === 0 ? (_jsx("p", { className: "no-products", children: "Hen\u00FCz \u00FCr\u00FCn eklemediniz." })) : (_jsx("div", { className: "products-list", children: products.map(product => (_jsxs("div", { className: "product-item", children: [_jsxs("div", { className: "product-info", children: [_jsx("h4", { children: product.name }), _jsx("p", { className: "category", children: product.category_name }), _jsxs("p", { className: "price", children: ["\u20BA", product.price, " / ", product.unit] }), _jsxs("p", { className: "quantity", children: ["Stok: ", product.quantity, " ", product.unit] }), product.location && _jsxs("p", { className: "location", children: ["\uD83D\uDCCD ", product.location] })] }), _jsx("button", { className: "btn-delete", onClick: () => handleDeleteProduct(product.id), disabled: loading, children: "Sil" })] }, product.id))) }))] })] })] }) }));
}
