import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    setRequirements(checks);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
        passwordConfirm
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response?.data?.requirements) {
        setError("Mot de passe faible");
      } else {
        setError(error.response?.data?.error || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Créer un nouveau mot de passe</h1>
          <p>Assurez-vous que votre mot de passe est fort et unique</p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Critères de validation */}
          <div className="password-requirements">
            <p className="requirements-title">Critères du mot de passe :</p>
            <div className={`requirement ${requirements.length ? 'met' : 'unmet'}`}>
              ✓ Au minimum 8 caractères
            </div>
            <div className={`requirement ${requirements.uppercase ? 'met' : 'unmet'}`}>
              ✓ Au moins 1 lettre majuscule (A-Z)
            </div>
            <div className={`requirement ${requirements.lowercase ? 'met' : 'unmet'}`}>
              ✓ Au moins 1 lettre minuscule (a-z)
            </div>
            <div className={`requirement ${requirements.number ? 'met' : 'unmet'}`}>
              ✓ Au moins 1 chiffre (0-9)
            </div>
            <div className={`requirement ${requirements.special ? 'met' : 'unmet'}`}>
              ✓ Au moins 1 caractère spécial (@, $, !, %, etc.)
            </div>
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || !Object.values(requirements).every(v => v)}
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
