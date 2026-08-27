import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const Parametres = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        api.get('/auth/profile')
            .then(response => setProfile(response.data.user))
            .catch(error => console.error("Erreur au chargement du profil", error))
            .finally(() => setLoading(false));
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!currentPassword || !newPassword || !newPasswordConfirm) {
            setErrorMessage("Tous les champs sont obligatoires");
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setErrorMessage("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword,
                newPasswordConfirm
            });
            setSuccessMessage(response.data.message);
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Erreur lors du changement de mot de passe");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="parametres-page"><p>Chargement...</p></div>;
    }

    return (
        <div className="parametres-page">
            <div className="page-header">
                <h1 className="page-title">Paramètres</h1>
                <p className="page-subtitle">Gérez vos informations et la sécurité de votre compte.</p>
            </div>

            <div className="parametres-grid">
                {/* CARTE PROFIL */}
                <div className="card">
                    <h2>Informations du compte</h2>
                    <div className="profile-info-row">
                        <div className="profile-icon"><FiUser size={20} /></div>
                        <div>
                            <p className="profile-label">Nom</p>
                            <p className="profile-value">{profile?.nom}</p>
                        </div>
                    </div>
                    <div className="profile-info-row">
                        <div className="profile-icon"><FiMail size={20} /></div>
                        <div>
                            <p className="profile-label">Email</p>
                            <p className="profile-value">{profile?.email}</p>
                        </div>
                    </div>
                    <div className="profile-info-row">
                        <div className="profile-icon"><FiShield size={20} /></div>
                        <div>
                            <p className="profile-label">Rôle</p>
                            <p className="profile-value">{profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                        </div>
                    </div>
                </div>

                {/* CARTE CHANGER MOT DE PASSE */}
                <div className="card">
                    <h2>Changer le mot de passe</h2>

                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <form onSubmit={handleChangePassword} className="parametres-form" autoComplete="off">
                        <div className="form-group">
                            <label>Mot de passe actuel</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" size={18} />
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    name="current-password-change"
                                    autoComplete="new-password"
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowCurrent(!showCurrent)}>
                                    {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nouveau mot de passe</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" size={18} />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    name="new-password"
                                    autoComplete="new-password"
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowNew(!showNew)}>
                                    {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirmer le nouveau mot de passe</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" size={18} />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPasswordConfirm}
                                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                    name="new-password-confirmation"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? "Modification..." : "Changer le mot de passe"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Parametres;
