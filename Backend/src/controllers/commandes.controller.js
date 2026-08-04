const db = require('../config/db');
const getAllCommandes = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const statut = req.query.statut || "";
    const type = req.query.type || "";
    const date = req.query.date || "";

    let whereClauses = [];
    let params = [];

    if (search) {
        whereClauses.push(`(cl.nom LIKE ? OR cl.prenom LIKE ? OR c.type_vetement LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (statut) {
        whereClauses.push(`c.statut = ?`);
        params.push(statut);
    }
    if (type) {
        whereClauses.push(`c.type_vetement = ?`);
        params.push(type);
    }
    if (date) {
        whereClauses.push(`DATE(c.date_commande) = ?`);
        params.push(date);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `
        SELECT COUNT(*) as total 
        FROM commandes c
        JOIN clients cl ON c.client_id = cl.id
        ${whereSQL}
    `;

    db.query(countQuery, params, (err, countResults) => {
        if (err) return res.status(500).json({ err });
        const total = countResults[0].total;

        const dataQuery = `
            SELECT c.*
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            ${whereSQL}
            ORDER BY c.date_commande DESC
            LIMIT ? OFFSET ?
        `;

        db.query(dataQuery, [...params, limit, offset], (err, results) => {
            if (err) return res.status(500).json({ err });
            res.json({ results, total, page, limit, pages: Math.ceil(total / limit) });
        });
    });
};
const getCommandesByClient = (req, res) => {
    const client_id = req.params.client_id;
    db.query('SELECT * FROM commandes WHERE client_id = ? ORDER BY date_commande DESC', [client_id], (err, results) => {
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

const getCommandesStats = (req, res) => {
    const query = `
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN statut = 'EN_ATTENTE' THEN 1 ELSE 0 END) AS enAttente,
            SUM(CASE WHEN statut = 'EN_COURS' THEN 1 ELSE 0 END) AS enCours,
            SUM(CASE WHEN statut = 'TERMINE' THEN 1 ELSE 0 END) AS terminees,
            SUM(CASE WHEN statut = 'LIVRE' THEN 1 ELSE 0 END) AS livrees
        FROM commandes
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ err });
        res.json(results[0]);
    });
};
module.exports = {getAllCommandes, getCommandesByClient, createCommande, updateCommande, deleteCommande, getCommandesStats};