const db = require('../config/db');
const getAllCommandes = (req, res) => {
    db.query('SELECT * FROM commandes', (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    });
}
const getCommandesByClient = (req, res) => {
    const client_id = req.params.client_id;
    db.query('SELECT * FROM commandes WHERE client_id = ?', [client_id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }

    });

}
const createCommande = (req, res) => {
        const client_id = req.params.client_id;
        const {type_vetement, description, date_livraison, statut} = req.body;
        db.query('INSERT INTO commandes(type_vetement, description, date_livraison, statut, client_id) VALUES(?,?,?,?,?)', [type_vetement, description, date_livraison, statut, client_id], (err, results) => {
            if(err){
                res.status(500).json({err});
            }
            else{
                res.json({results});
            }
        });


}
const updateCommande = (req, res) => {
    const id = req.params.id;
    const {type_vetement, description, date_livraison, statut} = req.body;
    db.query('UPDATE commandes SET type_vetement = ?, description = ?,date_livraison = ?, statut = ? WHERE id = ?', [type_vetement, description, date_livraison, statut, id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    });

}
const deleteCommande = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM commandes WHERE id = ?', [id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    });
}
module.exports = {getAllCommandes, getCommandesByClient, createCommande, updateCommande, deleteCommande};