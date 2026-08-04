import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import api from '../services/api.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail("");
      
      // Redirige après 3 secondes
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-button" onClick={() => navigate('/login')}>
          <FiArrowLeft size={20} />
          Retour
        </button>

        <div className="auth-header">
          <h1>Réinitialiser votre mot de passe</h1>
          <p>Entrez votre email et nous vous enverrons un lien de réinitialisation</p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <p className="auth-footer-text">
          Vous vous souvenez de votre mot de passe ? 
          <a href="/login"> Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;