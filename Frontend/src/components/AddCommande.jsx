import {useState} from 'react';
import api from '../services/api.js';

const AddCommande = ({setCommandes,selectedClientId}) => {
    const [type_vetement, setType_vetement] = useState("");
    const [description, setDescription] = useState("");
    const [date_livraison, setDate_livraison] = useState("");
    const [statut, setStatut] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!selectedClientId){
            alert("Veuillez sélectionner un client");
            return;
        }
        try {
            await api.post(`/commandes/${selectedClientId}`,{
                type_vetement,
                description,
                date_livraison,
                statut
            });
            await api.get(`/commandes/${selectedClientId}`).then(response => {setCommandes(response.data.results);});
            setType_vetement("");
            setDescription("");
            setDate_livraison("");
            setStatut("");
            

        }
        catch(error){
            console.log("Erreur lors de l'ajout de la commande client", error);
        }
    };

    return(

        <form onSubmit={handleSubmit}>
            <div>
                <label > Type_vetement</label>
                <input type="text" name = "type_vetement" value={type_vetement} onChange={(e) => setType_vetement(e.target.value)} />
            </div>

            <div>
                <label > Description</label>
                <input type="text" name = "description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label > Date_livraison</label>
                <input type="text" name='date_livraison' value={date_livraison} onChange={(e) => setDate_livraison(e.target.value)} />
            </div>
            <select name='statut' value={statut} onChange={(e) => setStatut(e.target.value)}>
  <option value="">Choisir un statut</option>
  <option value="EN_ATTENTE">En attente</option>
  <option value="EN_COURS">En cours</option>
  <option value="TERMINE">Terminé</option>
  <option value="LIVRE">Livré</option>
</select>
            

            <button type='submit'> Ajouter</button>


        </form>
    );

       
};
export default AddCommande;