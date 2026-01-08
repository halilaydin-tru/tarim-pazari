import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { userAPI } from '../api/api';
import '../styles/Auth.css';
export function RegisterForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        role: 'farmer',
        location: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }
        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await userAPI.register(registerData);
            // Kayıt başarılı
            setSuccess('Kayıt başarılı! Lütfen giriş yapınız.');
            // 2 saniye sonra giriş sayfasına dön
            setTimeout(() => {
                if (onSuccess)
                    onSuccess();
            }, 1500);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Kayıt başarısız');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { className: "auth-form", onSubmit: handleSubmit, children: [_jsx("h2", { children: "Kay\u0131t Ol" }), error && _jsx("div", { className: "error-message", children: error }), success && _jsx("div", { className: "success-message", children: success }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "full_name", children: "Ad Soyad" }), _jsx("input", { id: "full_name", type: "text", name: "full_name", value: formData.full_name, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "role", children: "Rol" }), _jsxs("select", { id: "role", name: "role", value: formData.role, onChange: handleChange, required: true, disabled: loading, children: [_jsx("option", { value: "farmer", children: "\u00C7ift\u00E7i" }), _jsx("option", { value: "producer", children: "\u00DCretici" })] })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "username", children: "Kullan\u0131c\u0131 Ad\u0131" }), _jsx("input", { id: "username", type: "text", name: "username", value: formData.username, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "E-posta" }), _jsx("input", { id: "email", type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "\u015Eifre" }), _jsx("input", { id: "password", type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "\u015Eifre Tekrar" }), _jsx("input", { id: "confirmPassword", type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, required: true, disabled: loading })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "location", children: "Konum" }), _jsx("input", { id: "location", type: "text", name: "location", value: formData.location, onChange: handleChange, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "phone", children: "Telefon" }), _jsx("input", { id: "phone", type: "tel", name: "phone", value: formData.phone, onChange: handleChange, disabled: loading })] })] }), _jsx("button", { type: "submit", className: "btn-submit", disabled: loading, children: loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol' })] }));
}
