import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';
import '../styles/UserProfile.css';
export function UserProfile({ onClose }) {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        location: user?.location || '',
        phone: user?.phone || '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const response = await userAPI.updateUser(user?.id || 0, formData);
            updateUser(response.data);
            setSuccess('Profil başarıyla güncellendi!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Güncelleme başarısız');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "user-profile-modal", children: [_jsx("div", { className: "profile-overlay", onClick: onClose }), _jsxs("div", { className: "profile-card", children: [_jsxs("div", { className: "profile-header", children: [_jsx("h2", { children: "Profil Bilgileri" }), _jsx("button", { className: "close-btn", onClick: onClose, children: "\u2715" })] }), _jsxs("div", { className: "profile-info", children: [_jsxs("div", { className: "info-item", children: [_jsx("label", { children: "Ad Soyad:" }), _jsx("span", { children: user?.full_name })] }), _jsxs("div", { className: "info-item", children: [_jsx("label", { children: "E-posta:" }), _jsx("span", { children: user?.email })] }), _jsxs("div", { className: "info-item", children: [_jsx("label", { children: "Rol:" }), _jsx("span", { className: "role-badge", children: user?.role === 'farmer' ? '🌾 Çiftçi' : '🏭 Üretici' })] }), _jsxs("div", { className: "info-item", children: [_jsx("label", { children: "Konum:" }), _jsx("span", { children: user?.location || '-' })] }), _jsxs("div", { className: "info-item", children: [_jsx("label", { children: "Telefon:" }), _jsx("span", { children: user?.phone || '-' })] })] }), !isEditing ? (_jsx("button", { className: "btn-edit", onClick: () => setIsEditing(true), children: "\u270F\uFE0F Bilgileri D\u00FCzenle" })) : (_jsxs("form", { onSubmit: handleSubmit, className: "edit-form", children: [error && _jsx("div", { className: "error-message", children: error }), success && _jsx("div", { className: "success-message", children: success }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "full_name", children: "Ad Soyad" }), _jsx("input", { id: "full_name", type: "text", name: "full_name", value: formData.full_name, onChange: handleChange, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "E-posta" }), _jsx("input", { id: "email", type: "email", name: "email", value: formData.email, onChange: handleChange, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "location", children: "Konum" }), _jsx("input", { id: "location", type: "text", name: "location", placeholder: "\u015Eehir ad\u0131n\u0131 girin", value: formData.location, onChange: handleChange, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "phone", children: "Telefon" }), _jsx("input", { id: "phone", type: "tel", name: "phone", placeholder: "+90 (555) 123-4567", value: formData.phone, onChange: handleChange, disabled: loading })] }), _jsxs("div", { className: "form-buttons", children: [_jsx("button", { type: "submit", className: "btn-save", disabled: loading, children: loading ? 'Kaydediliyor...' : '💾 Kaydet' }), _jsx("button", { type: "button", className: "btn-cancel", onClick: () => {
                                            setIsEditing(false);
                                            setFormData({
                                                full_name: user?.full_name || '',
                                                email: user?.email || '',
                                                location: user?.location || '',
                                                phone: user?.phone || '',
                                            });
                                        }, disabled: loading, children: "\u0130ptal" })] })] }))] })] }));
}
