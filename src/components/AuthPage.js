import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import '../styles/Auth.css';
export function AuthPage({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const handleRegistrationSuccess = () => {
        // Başarılı kayıt sonrası giriş sayfasına dön
        setIsLogin(true);
    };
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-container", children: [_jsxs("div", { className: "auth-header", children: [_jsx("h1", { children: "\uD83C\uDF3E Tar\u0131m Ticaret Pazar\u0131" }), _jsx("p", { children: "\u00C7ift\u00E7iler ve \u00FCreticileri do\u011Frudan bir araya getiren platform" })] }), isLogin ? (_jsxs(_Fragment, { children: [_jsx(LoginForm, { onSuccess: onAuthSuccess }), _jsx("div", { className: "auth-toggle", children: _jsxs("p", { children: ["Hesab\u0131n\u0131z yok mu?", _jsx("button", { onClick: () => setIsLogin(false), children: "Kay\u0131t olmak i\u00E7in t\u0131klay\u0131n" })] }) })] })) : (_jsxs(_Fragment, { children: [_jsx(RegisterForm, { onSuccess: handleRegistrationSuccess }), _jsx("div", { className: "auth-toggle", children: _jsxs("p", { children: ["Zaten hesab\u0131n\u0131z var m\u0131?", _jsx("button", { onClick: () => setIsLogin(true), children: "Giri\u015F yapmak i\u00E7in t\u0131klay\u0131n" })] }) })] }))] }) }));
}
