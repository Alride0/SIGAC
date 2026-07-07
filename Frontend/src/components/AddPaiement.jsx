import {useState} from 'react';
import api from '../services/api.js';

const AddPaiement = ({setPaiements, selectedCommandeId}) => {
    const [montant, setMontant] = useState("");
    const [avance, setAvance] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!selectedCommandeId){
            alert("Veuillez sélectionner une commande");
            return;
        }
        try {
            await api.post(`/paiements/${selectedCommandeId}`, {
                montant,
                avance
            });
            await api.get(`/paiements/${selectedCommandeId}`).then(response => {setPaiements(response.data.results);});
            setMontant("");
            setAvance("");

        }
        catch(error){
            console.log("Erreur lors de l'ajout du paiement", error);
        }
    };
    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label >Montant</label>
                <input type="text" name='montant' value={montant} onChange={(e) => setMontant(e.target.value)} />
            </div>
            <div>
                <label>Avance</label>
                <input type="text" name='avance' value={avance} onChange={(e) => setAvance(e.target.value)} />
            </div>

            <button type='submit'> Ajouter</button>
        </form>
    );

};
export default AddPaiement;