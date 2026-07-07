import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import '../styles/searchable-select.css';

const SearchableClientSelect = ({ clients, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(clients);
  const dropdownRef = useRef(null);

  // Filtrer les clients en temps réel
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((client) =>
        `${client.nom} ${client.prenom} ${client.telephone}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Récupérer le client sélectionné
  const selectedClient = clients.find((c) => c.id === value);

  const handleSelect = (clientId) => {
    onChange(clientId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className="searchable-select" ref={dropdownRef}>
      {/* Input avec icône */}
      <div 
        className="select-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="select-value">
          {selectedClient ? (
            <span>
              {selectedClient.nom} {selectedClient.prenom} - {selectedClient.telephone}
            </span>
          ) : (
            <span className="placeholder">Choisir un client...</span>
          )}
        </div>
        <div className="select-icons">
          {value && (
            <FiX 
              className="clear-icon" 
              size={18}
              onClick={handleClear}
            />
          )}
          <FiChevronDown 
            className={`chevron ${isOpen ? 'open' : ''}`}
            size={20}
          />
        </div>
      </div>

      {/* Dropdown ouvert */}
      {isOpen && (
        <div className="dropdown-menu">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher (nom, prénom, téléphone)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="dropdown-options">
            {filteredClients.length === 0 ? (
              <div className="no-results">Aucun client trouvé</div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`dropdown-option ${value === client.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(client.id)}
                >
                  <div className="option-full-info">
  <strong>{client.nom} {client.prenom}</strong> • {client.telephone} • {client.adresse}
</div>
                </div>
              ))
            )}
          </div>

          <div className="dropdown-info">
            {filteredClients.length} résultat{filteredClients.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableClientSelect;