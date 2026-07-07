import { useState, useEffect } from "react";
import api from '../services/api.js';
import AddPaiement from '../components/AddPaiement.jsx';

const Paiements = () => {
        const [paiements, setPaiements] = useState([]);
        const [selectedCommandeId, setSelectedCommandeId] = useState("");
        const [commandes, setCommandes] = useState([]);

        useEffect(() => {
            api.get('/commandes').then(response => {setCommandes(response.data.results);});

        }, [ ]);
        useEffect(() => {
            if(selectedCommandeId){
                api.get(`/paiements/${selectedCommandeId}`).then(response => {setPaiements(response.data.results);}).catch((error) => {
                    console.error(error);
                })
            }

        }, [selectedCommandeId]);
        return (
                <div>
                    <h2>Ajouter un paiement</h2>
                    {selectedCommandeId && <AddPaiement setPaiements = {setPaiements} selectedCommandeId = {selectedCommandeId}/>}
                    <select name="commande" id="commande" value={selectedCommandeId} onChange={(e) => setSelectedCommandeId(e.target.value)}>

                    <option value=""> Ajouter un paiement</option>
                    {commandes.map((commande) => (
                        <option key={commande.id}> {commande.type_vetement} {commande.description} {commande.date_livraison} {commande.statut} </option>
                    ))}
                    </select>

                    <ul>
                        {paiements.map((paiement) => (
                            <li key={paiement.id}> {paiement.montant} {paiement.avance} {paiement.reste} {paiement.date_paiement} </li>
                        ))}
                    </ul>
                </div>


        );

};
export default Paiements;

