import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { FiUserPlus, FiMail, FiShield, FiX } from 'react-icons/fi';

const Utilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data.results);
        } catch (error) {
            console.error("Erreur au chargement des utilisateurs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setNom("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setFormError("");
        setFormSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!nom || !email || !password || !passwordConfirm) {
            setFormError("Tous les champs sont obligatoires");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/auth/register', { nom, email, password, passwordConfirm });
            setFormSuccess("Compte créé avec succès");
            await fetchUsers();
            setTimeout(() => {
                setIsModalOpen(false);
                resetForm();
            }, 1200);
        } catch (error) {
            setFormError(error.response?.data?.error || "Erreur lors de la création du compte");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="utilisateurs-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestion des utilisateurs</h1>
                    <p className="page-subtitle">Gérez les comptes ayant accès à l'application.</p>
                </div>
                <button className="btn-nouveau-user" onClick={() => setIsModalOpen(true)}>
                    <FiUserPlus size={20} />
                    Créer un compte
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Créé le</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Aucun utilisateur</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.nom}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Créer un nouveau compte</h2>
                            <button className="modal-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                                <FiX size={22} />
                            </button>
                        </div>

                        {formSuccess && <div className="success-message">{formSuccess}</div>}
                        {formError && <div className="error-message">{formError}</div>}

                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-group">
                                <label>Nom complet</label>
                                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Confirmer le mot de passe</label>
                                <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                            </div>

                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? "Création..." : "Créer le compte"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Utilisateurs;