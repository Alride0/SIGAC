import { useState } from 'react';
import api from '../services/api.js';
import { FiX } from 'react-icons/fi';

const CreateClientModal = ({ isOpen, onClose, onClientCreated }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nom.trim() || !prenom.trim() || !telephone.trim() || !adresse.trim()) {
      setFormError("Tous les champs sont obligatoires");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await api.post('/clients', {
        nom,
        prenom,
        telephone,
        adresse
      });

      
      if (onClientCreated) {
        onClientCreated(response.data.results);
      }

      
      resetForm();
      onClose();
    } catch (error) {
      setFormError("Erreur lors de la création du client");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setTelephone("");
    setAdresse("");
    setFormError("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      
      <div className="modal-overlay" onClick={handleCancel}></div>

      
      <div className="modal-content">
        
        <div className="modal-header">
          <h2>Créer un nouveau client</h2>
          <button className="modal-close" onClick={handleCancel}>
            <FiX size={24} />
          </button>
        </div>

       
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nom complet</label>
              <input 
                type="text" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Prénom</label>
              <input 
                type="text" 
                value={prenom} 
                onChange={(e) => setPrenom(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input 
                type="text" 
                value={telephone} 
                onChange={(e) => setTelephone(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input 
                type="text" 
                value={adresse} 
                onChange={(e) => setAdresse(e.target.value)} 
                required 
              />
            </div>
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Création..." : "Créer le client"}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateClientModal;