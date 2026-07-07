const db = require('../config/db');
const getPaiementsByCommandes = (req, res) => {
    const commande_id = req.params.commande_id;
    db.query('SELECT * FROM paiements WHERE commande_id = ?', [commande_id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    });
}
const addPaiement = (req, res) => {
    const commande_id = req.params.commande_id;
    const { montant, avance} = req.body;
    const reste = montant - avance;
    db.query('INSERT INTO paiements(montant, avance, reste, commande_id) VALUES(?,?,?,?) ', [montant, avance, reste, commande_id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    });
}
const updatePaiement = (req, res) => {
    const id = req.params.id;
    const { montant, avance} = req.body;
    const reste = montant - avance;
    db.query('UPDATE paiements SET montant = ?, avance = ?, reste = ? WHERE id = ?', [montant, avance, reste, id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else{
            res.json({results});
        }
    })
    
}
const deletePaiement = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM paiements WHERE id = ?', [id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else{
            res.json({results});
        }
    });
}
module.exports = {getPaiementsByCommandes, addPaiement, updatePaiement, deletePaiement};