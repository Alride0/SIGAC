import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiX, FiSearch, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SearchableClientSelect = ({ clients, value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(clients);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div
    className={`select-input ${isOpen ? "active" : ""} ${disabled ? "disabled" : ""}`}
    onClick={() => !disabled && setIsOpen(!isOpen)}>
        <div className="select-left">
          <FiUser className="select-user-icon" />

          <div className="select-value">
            {selectedClient ? (
              <span>
                {selectedClient.nom} {selectedClient.prenom}
              </span>
            ) : (
              <span className="placeholder">
                Sélectionner un client
              </span>
            )}
          </div>
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
            size={20}
            className={`chevron ${isOpen ? "open" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22 }}>

            <div className="dropdown-search">
              <FiSearch className="search-icon" />

              <input
                type="text"
                className="search-input"
                aria-label="Rechercher un client"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="dropdown-options">
              {filteredClients.length === 0 ? (
                <div className="no-results">
                  Aucun client trouvé
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`dropdown-option ${
                      value === client.id ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(client.id)}
                  >
                    <div className="option-full-info">
                      <strong>
                        {client.nom} {client.prenom}
                      </strong>

                      <span>{client.telephone}</span>

                      <small>{client.adresse}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="dropdown-info">
              {filteredClients.length} résultat
              {filteredClients.length > 1 ? "s" : ""}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SearchableClientSelect;
