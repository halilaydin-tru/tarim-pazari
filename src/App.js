import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ProductMarket } from './components/ProductMarket';
import { SellerDashboard } from './components/SellerDashboard';
import { AboutPage } from './components/AboutPage';
import { UserProfile } from './components/UserProfile';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './context/AuthContext';
import './App.css';
import './styles/HomePage.css';
import './styles/AboutPage.css';
import './styles/UserProfile.css';
function App() {
    const { user, isLoggedIn, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState('home');
    const [showProfile, setShowProfile] = useState(false);
    if (!isLoggedIn) {
        return _jsx(AuthPage, {});
    }
    return (_jsxs("div", { className: "app", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "nav-container", children: [_jsx("h2", { className: "nav-brand", onClick: () => setCurrentPage('home'), style: { cursor: 'pointer' }, children: "\uD83C\uDF3E Tar\u0131m Ticaret Pazar\u0131" }), _jsxs("div", { className: "nav-links", children: [_jsx("button", { className: `nav-btn ${currentPage === 'home' ? 'active' : ''}`, onClick: () => setCurrentPage('home'), children: "\uD83C\uDFE0 Ana Sayfa" }), _jsx("button", { className: `nav-btn ${currentPage === 'market' ? 'active' : ''}`, onClick: () => setCurrentPage('market'), children: "\uD83D\uDECD\uFE0F Pazar\u0131 Ke\u015Ffet" }), _jsx("button", { className: `nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`, onClick: () => setCurrentPage('dashboard'), children: "\uD83D\uDCCA Panelim" }), _jsx("button", { className: `nav-btn ${currentPage === 'about' ? 'active' : ''}`, onClick: () => setCurrentPage('about'), children: "\u2139\uFE0F Hakk\u0131nda" }), _jsxs("div", { className: "user-menu", children: [_jsxs("button", { className: "user-info-btn", onClick: () => setShowProfile(true), children: [_jsx("span", { className: "user-name", children: user?.full_name }), _jsx("span", { className: "user-role", children: user?.role === 'farmer' ? '🌾 Çiftçi' : '🏭 Üretici' })] }), _jsx("button", { className: "btn-logout", onClick: logout, children: "\u00C7\u0131k\u0131\u015F Yap" })] })] })] }) }), _jsxs("main", { className: "main-content", children: [currentPage === 'home' && _jsx(HomePage, {}), currentPage === 'market' && _jsx(ProductMarket, {}), currentPage === 'dashboard' && _jsx(SellerDashboard, {}), currentPage === 'about' && _jsx(AboutPage, {})] }), showProfile && _jsx(UserProfile, { onClose: () => setShowProfile(false) }), _jsx("footer", { className: "footer", children: _jsxs("div", { className: "footer-content", children: [_jsx("p", { children: "\u00A9 2026 Tar\u0131m Ticaret Pazar\u0131. T\u00FCm haklar\u0131 sakl\u0131d\u0131r." }), _jsx("p", { children: "\u00C7ift\u00E7ileri ve \u00FCreticileri do\u011Frudan bir araya getiren platform" })] }) })] }));
}
export default App;
