import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Auth.css';
export function LoginForm({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!recaptchaToken) {
            setError('Lütfen reCAPTCHA\'yı tamamlayın');
            return;
        }
        setLoading(true);
        try {
            const response = await userAPI.login({
                username,
                password,
                recaptcha_token: recaptchaToken
            });
            login(response.data);
            if (onSuccess)
                onSuccess();
        }
        catch (err) {
            setError(err.response?.data?.error || 'Giriş başarısız');
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        if (!recaptchaToken) {
            setError('Lütfen reCAPTCHA\'yı tamamlayın');
            return;
        }
        setLoading(true);
        try {
            // Decode JWT token to get user info
            const token = credentialResponse.credential;
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const response = await userAPI.googleLogin({
                google_id: decodedToken.sub,
                email: decodedToken.email,
                full_name: decodedToken.name,
                role: 'farmer' // Default role
            });
            login(response.data);
            if (onSuccess)
                onSuccess();
        }
        catch (err) {
            setError('Google ile giriş başarısız: ' + (err.response?.data?.error || err.message));
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleError = () => {
        setError('Google ile giriş başarısız oldu');
    };
    return (_jsxs("form", { className: "auth-form", onSubmit: handleSubmit, children: [_jsx("h2", { children: "Giri\u015F Yap" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "username", children: "Kullan\u0131c\u0131 Ad\u0131 veya E-posta" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Kullan\u0131c\u0131 ad\u0131n\u0131z veya e-postan\u0131z", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "\u015Eifre" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, disabled: loading })] }), _jsx("div", { className: "recaptcha-container", children: _jsx(ReCAPTCHA, { sitekey: "6LfUx0MsAAAAADpBh1ZD2zYyCBPDGOqi9mnpHU-N", onChange: (token) => setRecaptchaToken(token) }) }), _jsx("button", { type: "submit", className: "btn-submit", disabled: loading || !recaptchaToken, children: loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }), _jsx("div", { className: "divider", children: _jsx("span", { children: "veya" }) }), _jsx("div", { className: "google-login-container", children: _jsx(GoogleLogin, { onSuccess: handleGoogleSuccess, onError: handleGoogleError, text: "signin", width: "100%" }) })] }));
}
