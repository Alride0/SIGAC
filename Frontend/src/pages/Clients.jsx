import {useState, useEffect} from 'react';
import { FiArrowUp, FiArrowDown, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/api.js';
import AddClients from '../components/AddClients.jsx';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 5 });    

    //useEffect(() => { api.get('/clients').then(response => { setClients(response.data.results); setLoading(false);} )}, []);

const clientsFiltres = clients.filter((client) =>
    `${client.nom} ${client.prenom} ${client.telephone} ${client.adresse}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
);

 const clientsTries = [...clientsFiltres].sort((a, b) => {
        const valA = sortConfig.key === 'date_creation' ? new Date(a.date_creation) : a[sortConfig.key];
        const valB = sortConfig.key === 'date_creation' ? new Date(b.date_creation) : b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    const handleDelete = async (client) => {
    const confirmation = window.confirm(
        `Voulez-vous vraiment supprimer ${client.nom} ${client.prenom} ? Cette action est irréversible.`
    );
    if (!confirmation) return;

    try {
        await api.delete(`/clients/${client.id}`);
        await fetchClients();
        if (editingClient?.id === client.id) {
            setEditingClient(null);
        }
    } catch (error) {
        setErrorMessage("La suppression a échoué. Réessayez.");
    }
};
    const fetchClients = async (page = currentPage) => {
  try {
    const response = await api.get('/clients', {
      params: {
        page,
        limit: 2
      }
    });
    setClients(response.data.results);
    setPagination({
      total: response.data.total,
      pages: response.data.pages,
      limit: response.data.limit
    });
    setCurrentPage(page);
    setErrorMessage("");
  } catch (error) {
    setErrorMessage("Impossible de charger les clients. Vérifiez votre connexion.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchClients();
}, []);

    return(
        
                <div className="clients-container"> 
                <div className="page-header">
      <h1 className="page-title">Gestion des clients</h1>
      <p className="page-subtitle">Ajoutez, modifiez et gérez les informations de vos clients.</p>
    </div>
                {errorMessage && (
            <div className="error-banner">{errorMessage}</div>
        )}
            
                    <div className="form-card">
                <h2>{editingClient ? "Modifier le client" : "Ajouter un client"}</h2>
                <AddClients 
                    setClients={setClients} 
                    editingClient={editingClient} 
                    setEditingClient={setEditingClient} 
                />
            </div>
            
            <div className="clients-section">
  <h3>Liste des clients</h3>
  
  <div className="search-filter-bar">
    <div className="search-wrapper">
      <FiSearch className="search-icon" size={18} />
      <input 
        type="text" 
        className="search-input" 
        placeholder="Rechercher un client..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <button className="btn-filters">
      <FiFilter size={18} />
      Filtres
    </button>
  </div>
                {loading ? (<p className="loading-text">Chargement des clients...</p>):(
                <div className="table-wrapper">
                
                    <table className="clients-table">
                        <thead>
                            <tr>
                        <th onClick={() => handleSort('nom')} className="sortable">
                            <span className="th-content">Nom {sortConfig.key === 'nom' && (sortConfig.direction === 'asc' ? (
                                    <FiArrowUp className="sort-icon" />
                                ) : (
                                    <FiArrowDown className="sort-icon" />
                                )
                                )}
                            </span>
                            </th>
                                    <th onClick={() => handleSort('prenom')} className="sortable">
  <span className="th-content">
    Prenom
    {sortConfig.key === 'prenom' && (
      sortConfig.direction === 'asc' ? (
        <FiArrowUp className="sort-icon" />
      ) : (
        <FiArrowDown className="sort-icon" />
      )
    )}
  </span>
</th>
                          <th>Téléphone</th>
                                <th onClick={() => handleSort('adresse')} className="sortable">
  <span className="th-content">
    Adresse
    {sortConfig.key === 'adresse' && (
      sortConfig.direction === 'asc' ? (
        <FiArrowUp className="sort-icon" />
      ) : (
        <FiArrowDown className="sort-icon" />
      )
    )}
  </span>
</th>
                                <th onClick={() => handleSort('date_creation')} className="sortable">
  <span className="th-content">
    Date d'Ajout
    {sortConfig.key === 'date_creation' && (
      sortConfig.direction === 'asc' ? (
        <FiArrowUp className="sort-icon" />
      ) : (
        <FiArrowDown className="sort-icon" />
      )
    )}
  </span>
</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                {clientsTries.length === 0 ? (
                    <tr>
                        <td colSpan="6" className='empty-state'>Aucun client pour l'instant</td>
                    </tr>):(
        
                            clientsTries.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.nom}</td>
                                    <td>{client.prenom}</td>
                                    <td>{client.telephone}</td>
                                    <td>{client.adresse}</td>
                                    <td>{new Date(client.date_creation).toLocaleDateString('fr-FR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    })}</td>
                                    <td className="actions-cell">
  <button 
    className="btn-icon btn-edit" 
    onClick={() => setEditingClient(client)}
    title="Modifier ce client"
    aria-label="Modifier"
  >
    <FiEdit2 size={18} />
  </button>
  <button 
    className="btn-icon btn-delete" 
    onClick={() => handleDelete(client)}
        title="Supprimer ce client"
        aria-label="Supprimer"
    >
        <FiTrash2 size={18} />
    </button>
    </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                    )}
                        {/* Pagination */}
                {!loading && pagination.pages > 1 && (
                  <div className="pagination-wrapper">
                    <p className="pagination-info">
                      Affichage de {(currentPage - 1) * pagination.limit + 1} à{' '}
                      {Math.min(currentPage * pagination.limit, pagination.total)} sur{' '}
                      {pagination.total} clients
                    </p>

                    <div className="pagination-buttons">
                      <button
                        className="btn-pagination"
                        disabled={currentPage === 1}
                        onClick={() => fetchClients(currentPage - 1)}
                      >
                        ← Précédent
                      </button>

                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`btn-page ${currentPage === page ? 'active' : ''}`}
                          onClick={() => fetchClients(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        className="btn-pagination"
                        disabled={currentPage === pagination.pages}
                        onClick={() => fetchClients(currentPage + 1)}
                      >
                        Suivant →
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
                
};

export default Clients;