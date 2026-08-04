import { useState, useEffect } from 'react';
import api from '../services/api.js';
import SearchableClientSelect from './SearchableClientSelect.jsx';

const AddPaiement = ({ onSuccess, onClose, clients }) => {
    const [selectedClientId, setSelectedClientId] = useState("");
    const [commandesDuClient, setCommandesDuClient] = useState([]);
    const [selectedCommandeId, setSelectedCommandeId] = useState("");
    const [montant, setMontant] = useState("");
    const [avance, setAvance] = useState("");
    const [methodePaiement, setMethodePaiement] = useState("Espèces");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (selectedClientId) {
            api.get(`/commandes/${selectedClientId}`)
                .then(response => {
                    setCommandesDuClient(response.data.results);
                })
                .catch(error => {
                    console.error("Erreur au chargement des commandes", error);
                });
        } else {
            setCommandesDuClient([]);
        }
        setSelectedCommandeId("");
    }, [selectedClientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCommandeId || !montant || !avance) {
            setFormError("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setSubmitting(true);
        setFormError("");

        try {
            await api.post(`/paiements/${selectedCommandeId}`, {
                montant,
                avance,
                methode_paiement: methodePaiement
            });
            onSuccess();
        } catch (error) {
            setFormError("Erreur lors de l'ajout du paiement");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="paiement-form">
            <h2>Ajouter un paiement</h2>

            <div className="form-group">
                <label>Client</label>
                <SearchableClientSelect
                    clients={clients}
                    value={selectedClientId}
                    onChange={(newClientId) => setSelectedClientId(newClientId)}
                />
            </div>

            <div className="form-group">
                <label>Commande</label>
                <select
                    value={selectedCommandeId}
                    onChange={(e) => setSelectedCommandeId(e.target.value)}
                    disabled={!selectedClientId}
                >
                    <option value="">Choisir une commande</option>
                    {commandesDuClient.map((commande) => (
                        <option key={commande.id} value={commande.id}>
                            {commande.type_vetement} - {new Date(commande.date_commande).toLocaleDateString('fr-FR')} - {commande.statut}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Montant</label>
                <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Avance</label>
                <input type="number" value={avance} onChange={(e) => setAvance(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Méthode de paiement</label>
                <select value={methodePaiement} onChange={(e) => setMethodePaiement(e.target.value)}>
                    <option value="Espèces">Espèces</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Virement">Virement</option>
                </select>
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Enregistrement..." : "Enregistrer le paiement"}
                </button>
                <button type="button" className="btn-cancel" onClick={onClose}>
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default AddPaiement;