import { useState, useEffect } from "react";
import api from '../services/api.js';
import AddPaiement from '../components/AddPaiement.jsx';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiCreditCard, FiArrowDownCircle, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';

const Paiements = () => {
    const [paiements, setPaiements] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEncaisse: 0,
        totalAvances: 0,
        resteAEncaisser: 0,
        paiementsAujourdhui: 0,
        nombreAujourdhui: 0
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatut, setFilterStatut] = useState("");
    const [filterMethode, setFilterMethode] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 8 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPaiement, setEditingPaiement] = useState(null);
    const [clients, setClients] = useState([]);
    const [viewingPaiement, setViewingPaiement] = useState(null);

    // Charger toutes les commandes (pour le formulaire d'ajout)
    useEffect(() => {
        api.get('/commandes').then(response => {
            setCommandes(response.data.results || response.data);
        }).catch(error => {
            console.error("Erreur au chargement des commandes", error);
        });
    }, []);
    useEffect(() => {
    api.get('/clients', {
        params: { page: 1, limit: 1000 }
    }).then(response => {
        setClients(response.data.results);
    }).catch(error => {
        console.error("Erreur au chargement des clients", error);
    });
}, []);

    // Charger les stats
    const fetchStats = async () => {
        try {
            const response = await api.get('/stats/paiements');
            setStats(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Charger les paiements (avec pagination)
    const fetchPaiements = async () => {
    setLoading(true);
    try {
        const response = await api.get('/paiements', {
            params: {
                page: currentPage,
                limit: pagination.limit,
                search: searchTerm,
                statut: filterStatut,
                methode: filterMethode
            }
        });
        setPaiements(response.data.results);
        setPagination({
            total: response.data.total,
            pages: response.data.pages,
            limit: response.data.limit
        });
    } catch (error) {
        console.error("Erreur au chargement des paiements", error);
    } finally {
        setLoading(false);
    }
};

   useEffect(() => {
    const delayDebounce = setTimeout(() => {
        fetchPaiements();
    }, 500);

    return () => clearTimeout(delayDebounce);
}, [currentPage, searchTerm, filterStatut, filterMethode]);
    const handleDelete = async (paiementId) => {
        const confirmation = window.confirm("Voulez-vous vraiment supprimer ce paiement ?");
        if (!confirmation) return;

        try {
            await api.delete(`/paiements/${paiementId}`);
            await fetchPaiements();
            await fetchStats();
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
        }
    };

    // Filtrage local (sur la page actuellement chargée)
    

    const getStatutLabel = (statut) => {
    const labels = {
        'EN_ATTENTE': 'En attente',
        'EN_COURS': 'En cours',
        'TERMINE': 'Terminée',
        'LIVRE': 'Livrée'
    };
    return labels[statut] || statut;
};

    const getMethodeClass = (methode) => {
        const classes = {
            'Espèces': 'methode-especes',
            'Mobile Money': 'methode-mobile-money',
            'Virement': 'methode-virement'
        };
        return classes[methode] || 'methode-especes';
    };

    return (
        <div className="paiements-page">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestion des paiements</h1>
                    <p className="page-subtitle">Suivez et gérez tous les paiements liés aux commandes de votre atelier.</p>
                </div>
                <button 
                    className="btn-nouveau-paiement" 
                    onClick={() => {
                        setEditingPaiement(null);
                        setIsModalOpen(true);
                    }}
                >
                    <FiPlus size={20} />
                    Ajouter un paiement
                </button>
            </div>

            {/* STATS CARDS */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiCreditCard size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total encaissé</p>
                        <p className="stat-value">{Number(stats.totalEncaisse).toLocaleString('fr-FR')} FCFA</p>
                        <p className="stat-subtitle">Toutes périodes confondues</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiArrowDownCircle size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total avances</p>
                        <p className="stat-value">{Number(stats.totalAvances).toLocaleString('fr-FR')} FCFA</p>
                        <p className="stat-subtitle">
                            {stats.totalEncaisse > 0 ? ((stats.totalAvances / stats.totalEncaisse) * 100).toFixed(1) : 0}% du total encaissé
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiClock size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Reste à encaisser</p>
                        <p className="stat-value">{Number(stats.resteAEncaisser).toLocaleString('fr-FR')} FCFA</p>
                        <p className="stat-subtitle">
                            {stats.totalEncaisse > 0 ? ((stats.resteAEncaisser / stats.totalEncaisse) * 100).toFixed(1) : 0}% du total dû
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiCheckCircle size={28} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Paiements aujourd'hui</p>
                        <p className="stat-value">{Number(stats.paiementsAujourdhui).toLocaleString('fr-FR')} FCFA</p>
                        <p className="stat-subtitle">{stats.nombreAujourdhui} paiement(s) effectué(s)</p>
                    </div>
                </div>
            </div>

            {/* FILTRES */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>Rechercher un paiement, client, commande...</label>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Statut commande</label>
                    <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TERMINE">Terminée</option>
                        <option value="LIVRE">Livrée</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Méthode paiement</label>
                    <select value={filterMethode} onChange={(e) => setFilterMethode(e.target.value)}>
                        <option value="">Toutes les méthodes</option>
                        <option value="Espèces">Espèces</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Virement">Virement</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Date paiement</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>

                <button className="btn-filters">Filtres</button>
            </div>

            {/* TABLE */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>N° Paiement</th>
                            <th>Commande</th>
                            <th>Client</th>
                            <th>Statut commande</th>
                            <th>Date paiement</th>
                            <th>Méthode</th>
                            <th>Montant</th>
                            <th>Avance</th>
                            <th>Reste</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</td>
                            </tr>
                        ) : paiements.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                    Aucun paiement trouvé
                                </td>
                            </tr>
                        ) : (
                            paiements.map((paiement) => (
                                <tr key={paiement.id}>
                                    <td><strong>PAY-{paiement.id.toString().padStart(4, '0')}</strong></td>
                                    <td>CMD-{paiement.commande_id.toString().padStart(4, '0')}</td>
                                    <td>
                                        <div className="client-info">
                                            <div className="client-avatar">
                                                {paiement.nom?.charAt(0) || 'C'}
                                            </div>
                                            <div className="client-details">
                                                <p className="client-name">{paiement.nom} {paiement.prenom}</p>
                                                <p className="client-phone">{paiement.telephone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${paiement.statut_commande}`}>
                                            {getStatutLabel(paiement.statut_commande)}
                                        </span>
                                    </td>
                                    <td>{new Date(paiement.date_paiement).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>
                                        <span className={`methode-badge ${getMethodeClass(paiement.methode_paiement)}`}>
                                            {paiement.methode_paiement}
                                        </span>
                                    </td>
                                    <td className="montant-value">{Number(paiement.montant).toLocaleString('fr-FR')} FCFA</td>
                                    <td>{Number(paiement.avance).toLocaleString('fr-FR')} FCFA</td>
                                    <td className={Number(paiement.reste) === 0 ? 'reste-zero' : 'reste-positif'}>
                                        {Number(paiement.reste).toLocaleString('fr-FR')} FCFA
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button 
                                            className="btn-action" 
                                            title="Voir"
                                            onClick={() => setViewingPaiement(paiement)} >
                                            <FiEye size={16} />
                                        </button>
                                            <button 
                                                className="btn-action" 
                                                title="Modifier"
                                                onClick={() => {
                                                    setEditingPaiement(paiement);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button 
                                                className="btn-action delete" 
                                                title="Supprimer"
                                                onClick={() => handleDelete(paiement.id)}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {pagination.pages > 1 && (
                <div className="pagination-wrapper">
                    <button
                        className="btn-pagination"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </button>

                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`btn-page ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="btn-pagination"
                        onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                        disabled={currentPage === pagination.pages}
                    >
                        Suivant
                    </button>

                    <span className="pagination-info">
                        Affichage de {((currentPage - 1) * pagination.limit) + 1} à {Math.min(currentPage * pagination.limit, pagination.total)} sur {pagination.total} paiements.
                    </span>
                </div>
            )}

            {/* MODAL AJOUT/MODIFICATION PAIEMENT */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <AddPaiement
    clients={clients}
    onClose={() => setIsModalOpen(false)}
    onSuccess={() => {
        setIsModalOpen(false);
        fetchPaiements();
        fetchStats();
    }}
/>
                    </div>
                </div>
            )}

            {/* MODAL VOIR PAIEMENT (lecture seule) */}
{viewingPaiement && (
    <div className="modal-overlay" onClick={() => setViewingPaiement(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
                <h2>Détails du paiement</h2>
                <button className="btn-close" onClick={() => setViewingPaiement(null)}>
                    <FiX size={24} />
                </button>
            </div>

            <div className="commande-view-details">
                <div className="view-row">
                    <span className="view-label">N° Paiement</span>
                    <span className="view-value">PAY-{viewingPaiement.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Commande liée</span>
                    <span className="view-value">CMD-{viewingPaiement.commande_id.toString().padStart(4, '0')}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Client</span>
                    <span className="view-value">{viewingPaiement.nom} {viewingPaiement.prenom}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Statut commande</span>
                    <span className={`status-badge status-${viewingPaiement.statut_commande}`}>
                        {getStatutLabel(viewingPaiement.statut_commande)}
                    </span>
                </div>
                <div className="view-row">
                    <span className="view-label">Date paiement</span>
                    <span className="view-value">
                        {new Date(viewingPaiement.date_paiement).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div className="view-row">
                    <span className="view-label">Méthode</span>
                    <span className={`methode-badge ${getMethodeClass(viewingPaiement.methode_paiement)}`}>
                        {viewingPaiement.methode_paiement}
                    </span>
                </div>
                <div className="view-row">
                    <span className="view-label">Montant</span>
                    <span className="view-value">{Number(viewingPaiement.montant).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Avance</span>
                    <span className="view-value">{Number(viewingPaiement.avance).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Reste</span>
                    <span className={Number(viewingPaiement.reste) === 0 ? 'reste-zero' : 'reste-positif'}>
                        {Number(viewingPaiement.reste).toLocaleString('fr-FR')} FCFA
                    </span>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Paiements;