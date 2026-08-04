import { useState, useEffect } from "react";
import {FiUser,FiPhone,FiMapPin} from "react-icons/fi";
import api from '../services/api.js';

const AddClients = ({ setClients, editingClient, setEditingClient,onSuccess }) => {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingClient) {
            setNom(editingClient.nom);
            setPrenom(editingClient.prenom);
            setTelephone(editingClient.telephone);
            setAdresse(editingClient.adresse);
        } else {
        resetForm(); 
    }
    }, [editingClient]);

    const resetForm = () => {
        setNom("");
        setPrenom("");
        setTelephone("");
        setAdresse("");
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const telephoneRegex = /^[0-9+\s]{8,15}$/;
if (!telephoneRegex.test(telephone.trim())) {
    setFormError("Le numéro de téléphone semble invalide.");
    return;
}

        if (!nom.trim() || !prenom.trim() || !telephone.trim() || !adresse.trim()) {
            return;
        }
        setSubmitting(true);
    setFormError("");

        try {
            if (editingClient) {
                await api.put(`/clients/${editingClient.id}`, { nom, prenom, telephone, adresse });
                setEditingClient(null);
            } else {
                await api.post("/clients", { nom, prenom, telephone, adresse });
            }

            const response = await api.get("/clients");
            setClients(response.data.results);
            resetForm();
            if (onSuccess) {
                             onSuccess();
                       }
        }
        catch (error) {
    setFormError("Erreur lors de l'enregistrement. Vérifiez les informations saisies.");
} finally {
        setSubmitting(false);
    }
    };

    const handleCancel = () => {
        setEditingClient(null);
        resetForm();
    };

    return( 
  <form className="clients-form" onSubmit={handleSubmit}>
    <div className="form-grid">
      <div className="form-group">
        <label><FiUser />Nom</label>

        <div>
          <input type="text" name="nom"  value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
      </div>
      <div className="form-group">
        <label><FiUser />Prénom</label>

        <div>
          <input type="text" name="prenom"  value={prenom}onChange={(e) => setPrenom(e.target.value)}required/>
        </div>
      </div>
      <div className="form-group">
        <label><FiPhone />Téléphone</label>

        <div>
          <input type="text" name="telephone"  value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
        </div>
      </div>
      <div className="form-group">
        <label><FiMapPin />Adresse</label>

        <div>
          <input type="text" name="adresse"  value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
        </div>
</div>
    </div>

    <div className="form-actions">
      {formError && <p className="form-error">{formError}</p>}
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Enregistrement..." : (editingClient ? "Enregistrer les modifications" : "Enregistrer le client")}
      </button>
      <button type="button" className="btn-reset" onClick={handleCancel}>
        Réinitialiser
      </button>
      {editingClient && (
        <button type="button" className="btn-cancel" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </div>
  </form>
);
};

export default AddClients;