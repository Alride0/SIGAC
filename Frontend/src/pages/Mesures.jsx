import {useState, useEffect} from 'react'; 
import api from '../services/api.js'; 
import AddMesure from '../components/AddMesure.jsx';
import SearchableClientSelect from '../components/SearchableClientSelect.jsx';
import { FiArrowUp, FiArrowDown, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

const Mesures = () => { 
    const [mesures, setMesures] = useState([]); 
    const [selectedClientId, setSelectedClientId] = useState("");
    const [clients, setClients] = useState([]);
    const [editingMesure, setEditingMesure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [stats, setStats] = useState({ totalClients: 0, totalMesures: 0, derniereMesure: null, mesuresCeMois: 0 });
    const [statsLoading, setStatsLoading] = useState(true);
    const [historique, setHistorique] = useState([]);
    const [historiqueLoading, setHistoriqueLoading] = useState(false);



    
    useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/mesures');
      setStats(response.data);
      setStatsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des stats", error);
      setStatsLoading(false);
    }
  };
  
  fetchStats();
}, []);

    useEffect(() => { 
    api.get('/clients', {
        params: {
            page: 1,
            limit: 1000  // Force à récupérer jusqu'à 1000 clients
        }
    }).then(response => {
        setClients(response.data.results);
    }).catch(error => {
        console.error("Erreur au chargement des clients", error);
    })
}, []);

    useEffect(() => {
        if(selectedClientId) {
            fetchMesures();
        } else {
            setMesures([]);
            setLoading(false);
        }
    }, [selectedClientId]);

    const fetchMesures = async () => {
        try {
            const response = await api.get(`/mesures/${selectedClientId}`);
            setMesures(response.data.results);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Impossible de charger les mesures.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (mesure) => {
        const confirmation = window.confirm(
            `Voulez-vous vraiment supprimer cette mesure ? Cette action est irréversible.`
        );
        if (!confirmation) return;

        try {
            await api.delete(`/mesures/${mesure.id}`);
            await fetchMesures();
            if (editingMesure?.id === mesure.id) {
                setEditingMesure(null);
            }
        } catch (error) {
            setErrorMessage("La suppression a échoué. Réessayez.");
        }
    };

    

const fetchHistorique = async (mesure_id) => {
  setHistoriqueLoading(true);
  try {
    const response = await api.get(`/mesures/${mesure_id}/historique`);
    setHistorique(response.data.results);
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique", error);
    setHistorique([]);
  } finally {
    setHistoriqueLoading(false);
  }
};

    return( 
        
    <div className="mesures-container">
      {/* En-tête de page */}
      {/* Cartes de statistiques */}
{!statsLoading && (
  <div className="stats-cards">
    {/* Carte 1 : Clients */}
    <div className="stat-card">
      <div className="stat-icon clients-icon">👥</div>
      <div className="stat-content">
        <p className="stat-label">Clients</p>
        <p className="stat-value">{stats.totalClients}</p>
        <p className="stat-subtitle">Clients enregistrés</p>
      </div>
    </div>

    {/* Carte 2 : Mesures enregistrées */}
    <div className="stat-card">
      <div className="stat-icon mesures-icon">📏</div>
      <div className="stat-content">
        <p className="stat-label">Mesures enregistrées</p>
        <p className="stat-value">{stats.totalMesures}</p>
        <p className="stat-subtitle">Total des mesures</p>
      </div>
    </div>

    {/* Carte 3 : Dernière mesure */}
    <div className="stat-card">
      <div className="stat-icon derniere-icon">📅</div>
      <div className="stat-content">
        <p className="stat-label">Dernière mesure</p>
        <p className="stat-value">Aujourd'hui</p>
        <p className="stat-subtitle">
          {stats.derniereMesure ? new Date(stats.derniereMesure.created_at).toLocaleString('fr-FR') : 'Aucune'}
        </p>
      </div>
    </div>

    {/* Carte 4 : Mesures ce mois */}
    <div className="stat-card">
      <div className="stat-icon mois-icon">📈</div>
      <div className="stat-content">
        <p className="stat-label">Mesures ce mois</p>
        <p className="stat-value">{stats.mesuresCeMois}</p>
        <p className="stat-subtitle">+20% par rapport au mois dernier</p>
      </div>
    </div>
  </div>
)}
            {errorMessage && <div className="error-banner">{errorMessage}</div>}
            {/* Layout premium : Client sélection EN HAUT */}
<div className="mesures-premium-section">
  {/* Ligne 1 : Client Selection (prend toute la largeur) */}
  <div className="client-selection-panel">
    <div className="panel-header">
      <h3>📋 Sélectionner un client</h3>
    </div>
    <SearchableClientSelect
      clients={clients}
      value={selectedClientId}
      onChange={(newClientId) => {
        setSelectedClientId(newClientId);
        setEditingMesure(null);
        setMesures([]);
        setHistorique([]);
        if (newClientId) {
          const fetchNewClientMesures = async () => {
            try {
              const response = await api.get(`/mesures/${newClientId}`);
              setMesures(response.data.results);
            } catch (error) {
              console.error("Erreur au chargement des mesures", error);
            }
          };
          fetchNewClientMesures();
        }
      }}
    />
    {selectedClientId && (
      <div className="client-badge">
        ✓ {clients.find(c => c.id === selectedClientId)?.nom} {clients.find(c => c.id === selectedClientId)?.prenom}
      </div>
    )}
  </div>

  {/* Ligne 2 : Formulaire (prend toute la largeur) */}
  <div className="formulaire-panel">
    <div className="panel-header">
      <h3>➕ {editingMesure ? "Modifier la mesure" : "Ajouter une mesure"}</h3>
    </div>
    {selectedClientId ? (
      <AddMesure 
        setMesures={setMesures} 
        selectedClientId={selectedClientId}
        editingMesure={editingMesure}
        setEditingMesure={setEditingMesure}
        fetchMesures={fetchMesures}
      />
    ) : (
      <div className="empty-state-form">
        <p>👆 Sélectionnez un client ci-dessus pour ajouter des mesures</p>
      </div>
    )}
  </div>
</div>

<div className="mesures-section">
  <h3>Mesures du client</h3>
                
                {loading ? (
                    <p className="loading-text">Chargement...</p>
                ) : mesures.length === 0 ? (
                    <p className="empty-state">Aucune mesure pour ce client</p>
                ) : (
                    <div className="mesures-grid">
                        {mesures.map((mesure) => (
                            <div key={mesure.id} className="mesure-card">
                                    <div className="mesure-data">
                                <p><strong>Poitrine:</strong> {mesure.poitrine} cm</p>
                                <p><strong>Taille:</strong> {mesure.taille} cm</p>
                                <p><strong>Hanche:</strong> {mesure.hanche} cm</p>
                                <p><strong>Épaule:</strong> {mesure.epaule} cm</p>
                                <p><strong>Manche:</strong> {mesure.manche} cm</p>
                                <p><strong>Longueur:</strong> {mesure.longueur} cm</p>
                                <p><strong>Tour de bras:</strong> {mesure.tour_bras} cm</p>
                                <p><strong>Tour de cou:</strong> {mesure.tour_cou} cm</p>
                                <p><strong>Poignet:</strong> {mesure.poignet} cm</p>
                                <p><strong>Cuisse:</strong> {mesure.cuisse} cm</p>
                                <p><strong>Bas de pantalon:</strong> {mesure.bas_pantalon} cm</p>
                                <p><strong>Mollet:</strong> {mesure.mollet} cm</p>
                            </div>
                                        <div className="mesure-actions">
                                    <button 
                                        className="btn-icon btn-edit" 
                                        onClick={() => setEditingMesure(mesure)}
                                        title="Modifier cette mesure"
                                        aria-label="Modifier"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                    <button 
                                        className="btn-icon btn-delete" 
                                        onClick={() => handleDelete(mesure)}
                                        title="Supprimer cette mesure"
                                        aria-label="Supprimer"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Historique des modifications */}
{selectedClientId && mesures.length > 0 && (
  <div className="historique-section">
    <h3>Historique des modifications</h3>
    {historiqueLoading ? (
      <p className="loading-text">Chargement de l'historique...</p>
    ) : historique.length === 0 ? (
      <p className="empty-state">Aucun historique</p>
    ) : (
      <div className="timeline">
        {historique.map((log) => (
          <div key={log.id} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <p className="timeline-action">{log.action}</p>
              <p className="timeline-date">
                {new Date(log.created_at).toLocaleString('fr-FR')}
              </p>
              <p className="timeline-user">{log.user_name}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    {selectedClientId && mesures.length > 0 && !historiqueLoading && (
      <button 
        className="btn-voir-historique"
        onClick={() => {
          const firstMesure = mesures[0];
          if (historique.length === 0) {
            fetchHistorique(firstMesure.id);
          }
        }}
      >
         Voir tout l'historique
      </button>
    )}
  </div>
)}
            
        </div>

    );
};

export default Mesures;