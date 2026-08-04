import {useState, useEffect} from 'react'; 
import api from '../services/api.js'; 
import AddMesure from '../components/AddMesure.jsx';
import SearchableClientSelect from '../components/SearchableClientSelect.jsx';
import CreateClientModal from '../components/CreateClientModal.jsx';
import { FiUsers, FiCheckSquare, FiCalendar, FiTrendingUp, FiEdit2, FiTrash2, FiClock, FiHash } from 'react-icons/fi';
import { motion } from "framer-motion";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMesureForm, setShowMesureForm] = useState(false);

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
                limit: 1000
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

    const handleClientCreated = async (newClient) => {
        setClients([...clients, newClient]);
        setSelectedClientId(newClient.id);
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

    return (
        <div className="mesures-page">
            {/* TITRE EN HAUT */}
            <div className="page-header">
                <h1 className="page-title">Mesures</h1>
                <p className="page-subtitle">Gestion complète des mesures des clients</p>
            </div>

            {/* STATS CARDS */}
            {!statsLoading && (
                <div className="stats-cards">
                    <motion.div
                        className="stat-card"
                        whileHover={{ y: -6 }}
                        transition={{ duration: .25 }}>
                        <div className="stat-icon clients">
                            <FiUsers size={30}/>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Clients</p>
                            <p className="stat-value">{stats.totalClients}</p>
                            <p className="stat-subtitle">Clients enregistrés</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        whileHover={{ y: -6 }}
                        transition={{ duration: .25 }}>
                       <div className="stat-icon mesures">
                        <FiCheckSquare size={30}/>
                    </div>
                        <div className="stat-content">
                            <p className="stat-label">Mesures enregistrées</p>
                            <p className="stat-value">{stats.totalMesures}</p>
                            <p className="stat-subtitle">Total des mesures</p>
                        </div>
                    </motion.div>

                    <motion.div
                            className="stat-card"
                            whileHover={{ y: -6 }}
                            transition={{ duration: .25 }}>
                        <div className="stat-icon calendar">
                            <FiCalendar size={30} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Dernière mesure</p>
                            <p className="stat-value">Aujourd'hui</p>
                            <p className="stat-subtitle">
                                {stats.derniereMesure ? new Date(stats.derniereMesure.created_at).toLocaleString('fr-FR') : 'Aucune'}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
    className="stat-card"
    whileHover={{ y: -6 }}
    transition={{ duration: .25 }}>
                        <div className="stat-icon trend">
                            <FiTrendingUp size={30} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Mesures ce mois</p>
                            <p className="stat-value">{stats.mesuresCeMois}</p>
                            <p className="stat-subtitle">+20% par rapport au mois dernier</p>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* LAYOUT 2 COLONNES */}
            <div className="mesures-grid">
                {/* COLONNE GAUCHE — FORMULAIRE */}
                <div className="mesures-left">
                    <div className="card">
                        <div className="card-header">
                        <h2>Mesures</h2>

                        {!showMesureForm && (
                        <button
                            className="btn-primary"
                            onClick={() => setShowMesureForm(true)}
                            disabled={!selectedClientId}
                            title={!selectedClientId ? "Sélectionnez d'abord un client" : ""}>
                            + Nouvelle mesure
                        </button>
                    )}
                    </div>

                        <div className="section">
                            <h3>Sélectionner un client</h3>
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
                        </div>

                        <div className="section">
                            <h3>Ajouter ou modifier les mesures</h3>
                           {!selectedClientId ? (

                                 <div className="empty-state-box">
                            <FiHash size={28} className="empty-state-icon" />
                            <p>Cliquez sur <strong>Nouvelle mesure</strong> pour enregistrer les mesures du client.</p>
                        </div>
                            ) : showMesureForm ? (

                               <AddMesure
                                        setMesures={setMesures}
                                        selectedClientId={selectedClientId}
                                        editingMesure={editingMesure}
                                        setEditingMesure={setEditingMesure}
                                        fetchMesures={fetchMesures}
                                        onSuccess={() => {
                                            setShowMesureForm(false);
                                            setEditingMesure(null);
                                        }}
                                    />

                            ) : (

                                <p className="empty-state">
                                    Cliquez sur <strong>Nouvelle mesure</strong> pour enregistrer les mesures du client.
                                </p>

                            )}
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE — MESURES + HISTORIQUE */}
                <div className="mesures-right">
                    {/* MESURES ENREGISTRÉES */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Mesures enregistrées</h2>
                            
                        </div>

                        {loading ? (
                            <p className="loading">Chargement...</p>
                        ) : mesures.length === 0 ? (
                            <p className="empty-state">Aucune mesure pour ce client</p>
                        ) : (
                           <div className="mesures-list"> 
                                {mesures.map((mesure) => (
                                    <div key={mesure.id} className="mesure-item">
                                        <div className="measure-item-header">

                                            <div>

                                                <h3 className="measure-title">
                                                    Mesure #{mesure.id}
                                                </h3>

                                                <p className="measure-date">
                                                    {new Date(mesure.created_at).toLocaleString('fr-FR')}
                                                </p>

                                            </div>

                                        </div>
                                        <div className="measure-values-grid">

                                            <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Poitrine
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.poitrine} cm
                                                </div>
                                            </div>

                                            <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Taille
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.taille} cm
                                                </div>
                                            </div>

                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Hanche
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.hanche} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Epaule
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.epaule} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Manche
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.manche} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Longueur
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.longueur} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Tour de bras
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.tour_bras} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Tour de cou
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.tour_cou} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Poignet
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.poignet} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Cuisse
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.cuisse} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Bas de pantalon
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.bas_pantalon} cm
                                                </div>
                                            </div>
                                        <div className="measure-box">
                                                <div className="measure-box-label">
                                                    Mollet
                                                </div>

                                                <div className="measure-box-value">
                                                    {mesure.mollet} cm
                                                </div>
                                            </div>
                                            </div>
                                        <div className="measure-footer">

                                        <div className="measure-date">
                                            <FiClock />
                                            {new Date(mesure.created_at).toLocaleString("fr-FR")}
                                        </div>

                                        <div className="measure-buttons">

                                            <button
                                                className="btn-measure-edit"
                                                onClick={() => {
                                                    setEditingMesure(mesure);
                                                    setShowMesureForm(true);
                                                }}>
                                                <FiEdit2 />
                                                Modifier
                                            </button>

                                            <button
                                                className="btn-measure-delete"
                                                onClick={() => handleDelete(mesure)}
                                            >
                                                <FiTrash2 />
                                                Supprimer
                                            </button>

                                        </div>

                                    </div>
                                    </div>
                                    
                                ))}
                            </div>
                        )}
                    </div>

                    {/* HISTORIQUE */}
                    {selectedClientId && (
                        <div className="card">
                            <h2>Historique des modifications</h2>
                            {historiqueLoading ? (
                                <p className="loading">Chargement...</p>
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
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            <CreateClientModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClientCreated={handleClientCreated}
            />
        </div>
    );
};

export default Mesures;