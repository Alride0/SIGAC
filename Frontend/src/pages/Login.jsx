import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FiLock,FiSun,FiMoon} from "react-icons/fi";
import api from '../services/api.js';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [language, setLanguage] = useState("fr");
  const [darkMode, setDarkMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);
useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
    }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }

      onLogin();
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const texts = {
  fr: {
    welcome: "Bienvenue de retour !",
    description: "Connectez-vous à votre espace Atelier Gen's Couture",
    emailLabel: "Email ou nom d'utilisateur",
    emailPlaceholder: "Entrez votre email ou nom d'utilisateur",
    password: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    remember: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    login: "Se connecter",
    register: "Créer un compte",
    noAccount: "Vous n'avez pas de compte ?",
    signup: "Inscrivez-vous maintenant "
  },

  en: {
    welcome: "Welcome back!",
    description: "Login to your Atelier Gen's Couture space",
    emailLabel: "Email or username",
    emailPlaceholder: "Enter your email or username",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    remember: "Remember me",
    forgot: "Forgot password?",
    login: "Login",
    register: "Create account",
    noAccount: "Don't have an account?",
    signup: "Sign up now "
  }
};

const t = texts[language];
  return (
    <div 
    className={`login-container ${darkMode ? "dark" : ""}`}
    style={{
        backgroundPosition: `calc(50% + ${mousePos.x * -15}px) calc(50% + ${mousePos.y * -15}px)`
    }}>
        <div className="login-card">
            <div className="login-header">
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
                </button>
                <select 
                    className="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </select>
            </div>
          
            <div className="login-form-container">
                <div className="login-card-logo">
                    <img src="/new_img_logo.png" alt="Gens Couture" className="logo-img-small" />
                </div>

                <div className="login-welcome">
                    <div className="lock-icon">
                        <FiLock size={48} />
                    </div>
                    <h1>{t.welcome}</h1>
                    <p>{t.description}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                    <div className="form-group">
                        <label>{t.emailLabel}</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="off"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t.password}</label>
                        <div className="input-wrapper">
                                <input
                                type="password"
                                value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    className="form-input"
                                />

                            </div>
                    </div>

                    <div className="form-footer">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            {t.remember}
                        </label>
                        <a href="/forgot-password" className="forgot-password">{t.forgot}</a>
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading 
                            ? (language === "fr" ? "Connexion en cours..." : "Logging in...")
                            : t.login}
                    </button>
                </form>

               
            </div>
        </div>
    </div>
);
};

export default Login;
