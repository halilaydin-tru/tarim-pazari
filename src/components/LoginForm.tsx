import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Auth.css';

interface LoginProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);

    try {
      const response = await userAPI.login({ 
        username, 
        password
      });
      login(response.data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');

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
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError('Google ile giriş başarısız: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google ile giriş başarısız oldu');
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Giriş Yap</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">Kullanıcı Adı veya E-posta</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanıcı adınız veya e-postanız"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>

      <div className="divider">
        <span>veya</span>
      </div>

      <div className="google-login-container">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signin"
          width="100%"
        />
      </div>
    </form>
  );
}
