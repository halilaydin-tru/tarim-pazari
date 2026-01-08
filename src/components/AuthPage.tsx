import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import '../styles/Auth.css';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleRegistrationSuccess = () => {
    // Başarılı kayıt sonrası giriş sayfasına dön
    setIsLogin(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🌾 Tarım Ticaret Pazarı</h1>
          <p>Çiftçiler ve üreticileri doğrudan bir araya getiren platform</p>
        </div>

        {isLogin ? (
          <>
            <LoginForm onSuccess={onAuthSuccess} />
            <div className="auth-toggle">
              <p>Hesabınız yok mu? 
                <button onClick={() => setIsLogin(false)}>
                  Kayıt olmak için tıklayın
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <RegisterForm onSuccess={handleRegistrationSuccess} />
            <div className="auth-toggle">
              <p>Zaten hesabınız var mı? 
                <button onClick={() => setIsLogin(true)}>
                  Giriş yapmak için tıklayın
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
