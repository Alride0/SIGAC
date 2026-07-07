import { useState, useEffect } from "react";
import api from '../services/api.js';
const Dashboard = () => {
    const [totalClients, setTotalClients] = useState(0);
    const [commandesEnCours, setCommandesEnCours] = useState(0);
    const [totalPaiements, setTotalPaiements] = useState(0);
    useEffect(() => {
        api.get('/clients').then(response => { setTotalClients(response.data.results.length);});
    
    }, [ ]);
    useEffect(() => {
        api.get('/commandes').then(response => {setCommandesEnCours(response.data.results.length);});
    }, [ ]);
    useEffect(() => {
                api.get('/paiements').then(response => {setTotalPaiements(response.data.results.length);});

    }, [ ]);
    return (
        <div>
            <h2> Total clients: {totalClients} </h2>
            <h2> Commandes en cours: {commandesEnCours}</h2>
            <h2> Total Paiements: {totalPaiements} </h2>
            

        </div>
    );
};
export default Dashboard;