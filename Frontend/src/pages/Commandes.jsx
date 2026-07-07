import {useState, useEffect} from 'react';
import api from '../services/api.js';
import AddCommande from '../components/AddCommande.jsx';

const Commandes = () => {
    const [commandes, setCommandes] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [clients, setClients] = useState([]);

    useEffect(() => {api.get('/clients').then(response => { setClients(response.data.results);});}, [ ]);

    useEffect(() => {
        if(selectedClientId) {
            api.get(`/commandes/${selectedClientId}`).then(response => { setCommandes( response.data.results);}).catch((error) =>{
                console.error(error);
            });
        }
    }, [selectedClientId]);

    return(
        <div>
            <h2>Ajouter une commande</h2>
            {selectedClientId &&<AddCommande setCommandes = {setCommandes} selectedClientId = {selectedClientId}/>}
            <hr />
            <select name="client" id="client" value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                <option value=""> Choisir un Client</option>
                {clients.map((client) => (
                    <option key = {client.id} value={client.id}> {client.nom} {client.prenom} {client.telephone}</option>
                )
                    
                )}




            </select>
            <ul>
                {commandes.map((commande) => (
                    <li key = {commande.id}>{commande.type_vetement} {commande.description} {commande.date_livraison} {commande.statut}</li>
                ))}
                
                 </ul>
        </div>
    );

};
export default Commandes; 