import { useState, useEffect } from 'react';
import api from '../services/api.js';
import AddCommande from '../components/AddCommande.jsx';
import SearchableClientSelect from '../components/SearchableClientSelect.jsx';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiPackage, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi';


const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    enCours: 0,
    terminees: 0,
    livrees: 0
  });

  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'date_commande', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 8 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommandeId, setEditingCommandeId] = useState(null);
  const [viewMode, setViewMode] = useState('all'); 
  const [viewingCommande, setViewingCommande] = useState(null);

  
  useEffect(() => {
    api.get('/clients', {
      params: { page: 1, limit: 1000 }
    }).then(response => {
      setClients(response.data.results);
    }).catch(error => {
      console.error("Erreur au chargement des clients", error);
    });
  }, []);

  
useEffect(() => {
    const delayDebounce = setTimeout(() => {
        if (viewMode === 'all') {
            fetchAllCommandes();
        } else if (viewMode === 'client' && selectedClientId) {
            fetchCommandes();
        } else {
            setCommandes([]);
        }
    }, 500);

    return () => clearTimeout(delayDebounce);
}, [viewMode, selectedClientId, currentPage, searchTerm, filterStatut, filterType, filterDate]);

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/commandes/${selectedClientId}`, {
        params: { 
          page: currentPage, 
          limit: pagination.limit 
        }
      });
      setCommandes(response.data.results);
      setPagination({ 
        total: response.data.total, 
        pages: response.data.pages, 
        limit: response.data.limit 
      });
     
    } catch (error) {
      console.error("Erreur au chargement des commandes", error);
    } finally {
      setLoading(false);
    }
  };
 const fetchAllCommandes = async () => {
    setLoading(true);
    try {
        const response = await api.get('/commandes', {
            params: { 
                page: currentPage, 
                limit: pagination.limit,
                search: searchTerm,
                statut: filterStatut,
                type: filterType,
                date: filterDate
            }
        });
        setCommandes(response.data.results);
        setPagination({ 
            total: response.data.total, 
            pages: response.data.pages, 
            limit: response.data.limit 
        });
    } catch (error) {
        console.error("Erreur au chargement des commandes", error);
    } finally {
        setLoading(false);
    }
};
const fetchStats = async () => {
    try {
        const response = await api.get('/stats/commandes');
        setStats(response.data);
    } catch (error) {
        console.error("Erreur au chargement des stats", error);
    }
};

useEffect(() => {
    fetchStats();
}, []);


  const handleDelete = async (commandeId) => {
    const confirmation = window.confirm("Voulez-vous vraiment supprimer cette commande ?");
    if (!confirmation) return;

    try {
        await api.delete(`/commandes/${commandeId}`);
        if (viewMode === 'all') {
            await fetchAllCommandes();
        } else {
            await fetchCommandes();
        }
        await fetchStats();
    } catch (error) {
        console.error("Erreur lors de la suppression", error);
    }
};


  const getStatutBadge = (statut) => {
    const badges = {
        'EN_ATTENTE': { label: 'En attente', class: 'badge-attente' },
        'EN_COURS': { label: 'En cours', class: 'badge-cours' },
        'TERMINE': { label: 'Terminée', class: 'badge-terminee' },
        'LIVRE': { label: 'Livrée', class: 'badge-livree' }
    };
    return badges[statut] || { label: statut, class: 'badge-default' };
};

  const getStatutIcon = (statut) => {
    const icons = {
      'en_attente': <FiAlertCircle size={20} />,
      'en_cours': <FiClock size={20} />,
      'terminee': <FiCheckCircle size={20} />,
      'annulee': <FiXCircle size={20} />
    };
    return icons[statut] || <FiPackage size={20} />;
  };

  return (
  <div className="commandes-page">
    {/* PAGE HEADER */}
    <div className="page-header">
      <div>
        <h1 className="page-title">Gestion des commandes</h1>
        <p className="page-subtitle">Suivez et gérez toutes les commandes de votre atelier.</p>
      </div>
      <button 
    className="btn-nouvelle-commande" 
    onClick={() => {
        setEditingCommandeId(null);
        setIsModalOpen(true);
    }}>
    <FiPlus size={20} />
    Nouvelle commande
</button>
    </div>

    {/* STATS CARDS */}
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">
          <FiPackage size={32} />
        </div>
        <div className="stat-content">
          <p className="stat-label">Total commandes</p>
          <p className="stat-value">{stats.total}</p>
          <p className="stat-subtitle">Toutes les commandes</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FiAlertCircle size={32} />
        </div>
        <div className="stat-content">
          <p className="stat-label">En attente</p>
          <p className="stat-value">{stats.enAttente}</p>
          <p className="stat-subtitle">À traiter</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FiClock size={32} />
        </div>
        <div className="stat-content">
          <p className="stat-label">En cours</p>
          <p className="stat-value">{stats.enCours}</p>
          <p className="stat-subtitle">En cours de réalisation</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FiPackage size={32} />
        </div>
        <div className="stat-content">
          <p className="stat-label">Livrées</p>
          <p className="stat-value">{stats.livrees}</p>
          <p className="stat-subtitle">Commandes livrées</p>
        </div>
      </div>

    </div>

    {/* MODE SELECTOR */}
    <div className="card mode-selector">
      <div className="mode-buttons">
        <button 
          className={`mode-btn ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => {
            setViewMode('all');
            setCurrentPage(1);
            setSelectedClientId("");
            setEditingCommandeId(null);
          }}
        >
          Toutes les commandes
        </button>
        <button 
          className={`mode-btn ${viewMode === 'client' ? 'active' : ''}`}
          onClick={() => {
            setViewMode('client');
            setCurrentPage(1);
            setEditingCommandeId(null);
          }}
        >
          Commandes par client
        </button>
      </div>
    </div>

    {/* SÉLECTION CLIENT (Mode Client uniquement) */}
    {viewMode === 'client' && (
      <div className="card">
        <h3>Sélectionner un client</h3>
        <SearchableClientSelect
          clients={clients}
          value={selectedClientId}
          onChange={(newClientId) => {
            setSelectedClientId(newClientId);
            setCurrentPage(1);
            setEditingCommandeId(null);
          }}
        />
      </div>
    )}

    

    {/* FILTRES */}
    {commandes.length > 0 && (viewMode === 'all' || selectedClientId) && (
      <div className="filters-section">
        <div className="filter-group">
          <label>Rechercher une commande, client...</label>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Statut</label>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminée</option>
            <option value="LIVRE">Livrée</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type vêtement</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            <option value="Robe">Robe</option>
            <option value="Pantalon">Pantalon</option>
            <option value="Chemise">Chemise</option>
            <option value="Veste">Veste</option>
            <option value="Ensemble">Ensemble</option>
            <option value="Blouse">Blouse</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date commande</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <button className="btn-filters">
          Filtres
        </button>
      </div>
    )}

    {/* TABLE DES COMMANDES */}
    {commandes.length > 0 && (viewMode === 'all' || selectedClientId) && (
      <>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Type vêtement</th>
                <th>Date commande</th>
                <th>Date livraison</th>
                <th>Statut</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    Chargement...
                  </td>
                </tr>
              ) : (
                commandes.map((commande) => (
                  <tr key={commande.id}>
                    <td>
                      <strong>CMD-{commande.id.toString().padStart(4, '0')}</strong>
                    </td>
                    <td>
                      <div className="client-info">
                        <div className="client-avatar">
                          {clients.find(c => c.id === commande.client_id)?.nom?.charAt(0) || 'C'}
                        </div>
                        <div className="client-details">
                          <p className="client-name">
                            {clients.find(c => c.id === commande.client_id)?.nom || 'N/A'}
                          </p>
                          <p className="client-phone">
                            {clients.find(c => c.id === commande.client_id)?.telephone || ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{commande.type_vetement}</td>
                    <td>{new Date(commande.date_commande).toLocaleDateString('fr-FR')}</td>
                    <td>{new Date(commande.date_livraison).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className={`status-badge status-${commande.statut}`}>
                        {getStatutBadge(commande.statut).label}
                      </span>
                    </td>
                    <td>
                      <strong>{commande.montant ? commande.montant.toLocaleString('fr-FR') + ' FCFA' : '-'}</strong>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                        className="btn-action" 
                        title="Voir"
                        onClick={() => setViewingCommande(commande)}>
                        <FiEye size={18} />
                    </button>
                        <button  className="btn-action"  title="Modifier" onClick={() => { setEditingCommandeId(commande.id); setIsModalOpen(true);}}>
          <FiEdit2 size={18} />
      </button> 
                        <button 
                          className="btn-action delete" 
                          title="Supprimer"
                          onClick={() => handleDelete(commande.id)}
                        >
                          <FiTrash2 size={18} />
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
              Affichage de {((currentPage - 1) * pagination.limit) + 1} à {Math.min(currentPage * pagination.limit, pagination.total)} sur {pagination.total} commandes.
            </span>
          </div>
        )}
      </>
    )}

    {/* EMPTY STATE */}
    {commandes.length === 0 && (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#999', fontSize: '0.95rem' }}>
          {viewMode === 'all' 
            ? "Aucune commande enregistrée pour l'instant"
            : "Sélectionnez un client pour voir ses commandes"
          }
        </p>
      </div>
    )}
    {/* MODAL AJOUTER/MODIFIER COMMANDE */}
{isModalOpen && (
    <AddCommande 
        clients={clients}
        editingCommande={editingCommandeId ? commandes.find(c => c.id === editingCommandeId) : null}
        onCommandeAdded={() => {
            setIsModalOpen(false);
            setEditingCommandeId(null);
            if (viewMode === 'all') {
                fetchAllCommandes();
            } else {
                fetchCommandes();
            }
        }}
        onClose={() => {
            setIsModalOpen(false);
            setEditingCommandeId(null);
        }}
    />
)}

{/* MODAL VOIR COMMANDE (lecture seule) */}
{viewingCommande && (
    <div className="modal-overlay" onClick={() => setViewingCommande(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
                <h2>Détails de la commande</h2>
                <button className="btn-close" onClick={() => setViewingCommande(null)}>
                    <FiX size={24} />
                </button>
            </div>

            <div className="commande-view-details">
                <div className="view-row">
                    <span className="view-label">N° Commande</span>
                    <span className="view-value">CMD-{viewingCommande.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Client</span>
                    <span className="view-value">
                        {clients.find(c => c.id === viewingCommande.client_id)?.nom} {clients.find(c => c.id === viewingCommande.client_id)?.prenom}
                    </span>
                </div>
                <div className="view-row">
                    <span className="view-label">Type de vêtement</span>
                    <span className="view-value">{viewingCommande.type_vetement}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Description</span>
                    <span className="view-value">{viewingCommande.description}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Date de commande</span>
                    <span className="view-value">{new Date(viewingCommande.date_commande).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Date de livraison</span>
                    <span className="view-value">{new Date(viewingCommande.date_livraison).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="view-row">
                    <span className="view-label">Statut</span>
                    <span className={`status-badge status-${viewingCommande.statut}`}>
                        {getStatutBadge(viewingCommande.statut).label}
                    </span>
                </div>
                <div className="view-row">
                    <span className="view-label">Montant</span>
                    <span className="view-value">
                        {viewingCommande.montant ? viewingCommande.montant.toLocaleString('fr-FR') + ' FCFA' : 'Non défini'}
                    </span>
                </div>
            </div>
        </div>
    </div>
)}
  </div>
);
};

export default Commandes;