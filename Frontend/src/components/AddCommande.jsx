import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { FiX } from 'react-icons/fi';
import SearchableClientSelect from './SearchableClientSelect.jsx';

const AddCommande = ({ clients, editingCommande, onCommandeAdded, onClose }) => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [type_vetement, setType_vetement] = useState("");
  const [description, setDescription] = useState("");
  const [date_livraison, setDate_livraison] = useState("");
  const [statut, setStatut] = useState("EN_ATTENTE");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCommande) {
      setSelectedClientId(editingCommande.client_id || "");
      setType_vetement(editingCommande.type_vetement || "");
      setDescription(editingCommande.description || "");
      setDate_livraison(editingCommande.date_livraison?.split('T')[0] || "");
      setStatut(editingCommande.statut || "EN_ATTENTE");
      setMontant(editingCommande.montant || "");
    } else {
      resetForm();
    }
  }, [editingCommande]);

  const resetForm = () => {
    setSelectedClientId("");
    setType_vetement("");
    setDescription("");
    setDate_livraison("");
    setStatut("EN_ATTENTE");
    setMontant("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedClientId) {
      setError("Veuillez sélectionner un client");
      return;
    }

    if (!type_vetement || !description || !date_livraison) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);

    try {
      if (editingCommande) {
        await api.patch(`/commandes/${editingCommande.id}`, {
          type_vetement,
          description,
          date_livraison,
          statut,
          montant: montant ? parseFloat(montant) : null
        });
      } else {
        await api.post(`/commandes/${selectedClientId}`, {
          type_vetement,
          description,
          date_livraison,
          statut,
          montant: montant ? parseFloat(montant) : null
        });
      }

      resetForm();
      onCommandeAdded();
    } catch (error) {
      setError("Erreur lors de l'enregistrement de la commande");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{editingCommande ? "Modifier la commande" : "Ajouter une commande"}</h2>
          <button className="btn-close" onClick={handleCancel}>
            <FiX size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="commande-form">
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label>Client *</label>
            <SearchableClientSelect
              clients={clients}
              value={selectedClientId}
              onChange={(id) => setSelectedClientId(id)}
              disabled={!!editingCommande}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Type de vêtement *</label>
              <input
                type="text"
                value={type_vetement}
                onChange={(e) => setType_vetement(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Date de livraison *</label>
              <input
                type="date"
                value={date_livraison}
                onChange={(e) => setDate_livraison(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Statut</label>
              <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                <option value="EN_ATTENTE">En attente</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminée</option>
                <option value="LIVRE">Livrée</option>
              </select>
            </div>

            <div className="form-group">
              <label>Montant (FCFA)</label>
              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Enregistrement..." : (editingCommande ? "Modifier" : "Ajouter")}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommande;
