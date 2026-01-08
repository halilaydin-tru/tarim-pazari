import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App.tsx';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(GoogleOAuthProvider, { clientId: "YOUR_GOOGLE_CLIENT_ID", children: _jsx(AuthProvider, { children: _jsx(App, {}) }) }) }));
