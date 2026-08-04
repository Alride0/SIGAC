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

const getAllPaiements = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const statut = req.query.statut || "";
    const methode = req.query.methode || "";

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
    if (methode) {
        whereClauses.push(`p.methode_paiement = ?`);
        params.push(methode);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `
        SELECT COUNT(*) as total 
        FROM paiements p
        JOIN commandes c ON p.commande_id = c.id
        JOIN clients cl ON c.client_id = cl.id
        ${whereSQL}
    `;

    db.query(countQuery, params, (err, countResults) => {
        if (err) return res.status(500).json({ err });
        const total = countResults[0].total;

        const dataQuery = `
            SELECT 
                p.id, p.montant, p.avance, p.reste, p.methode_paiement, p.date_paiement,
                c.id AS commande_id, c.type_vetement, c.statut AS statut_commande,
                cl.id AS client_id, cl.nom, cl.prenom, cl.telephone
            FROM paiements p
            JOIN commandes c ON p.commande_id = c.id
            JOIN clients cl ON c.client_id = cl.id
            ${whereSQL}
            ORDER BY p.date_paiement DESC
            LIMIT ? OFFSET ?
        `;

        db.query(dataQuery, [...params, limit, offset], (err, results) => {
            if (err) return res.status(500).json({ err });
            res.json({ results, total, page, limit, pages: Math.ceil(total / limit) });
        });
    });
};
const addPaiement = (req, res) => {
    const commande_id = req.params.commande_id;
    const { montant, avance, methode_paiement } = req.body;
    const reste = montant - avance;
    db.query('INSERT INTO paiements(montant, avance, reste, methode_paiement, commande_id) VALUES(?,?,?,?,?) ', [montant, avance, reste, methode_paiement || 'Espèces', commande_id], (err, results) => {
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
    const { montant, avance, methode_paiement } = req.body;
    const reste = montant - avance;
    db.query('UPDATE paiements SET montant = ?, avance = ?, reste = ?, methode_paiement = ? WHERE id = ?', [montant, avance, reste, methode_paiement, id], (err, results) => {
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

const getPaiementsStats = (req, res) => {
    const totalQuery = `SELECT SUM(montant) as totalEncaisse FROM paiements`;
    
    db.query(totalQuery, (err, totalResults) => {
        if (err) return res.status(500).json({ err });
        const totalEncaisse = totalResults[0].totalEncaisse || 0;

        const avanceQuery = `SELECT SUM(avance) as totalAvances FROM paiements`;
        
        db.query(avanceQuery, (err, avanceResults) => {
            if (err) return res.status(500).json({ err });
            const totalAvances = avanceResults[0].totalAvances || 0;

            const resteQuery = `SELECT SUM(reste) as resteAEncaisser FROM paiements`;

            db.query(resteQuery, (err, resteResults) => {
                if (err) return res.status(500).json({ err });
                const resteAEncaisser = resteResults[0].resteAEncaisser || 0;

                const aujourdhuiQuery = `
                    SELECT SUM(montant) as paiementsAujourdhui, COUNT(*) as nombreAujourdhui 
                    FROM paiements 
                    WHERE DATE(date_paiement) = CURDATE()
                `;

                db.query(aujourdhuiQuery, (err, aujourdhuiResults) => {
                    if (err) return res.status(500).json({ err });
                    const paiementsAujourdhui = aujourdhuiResults[0].paiementsAujourdhui || 0;
                    const nombreAujourdhui = aujourdhuiResults[0].nombreAujourdhui || 0;

                    res.json({
                        totalEncaisse,
                        totalAvances,
                        resteAEncaisser,
                        paiementsAujourdhui,
                        nombreAujourdhui
                    });
                });
            });
        });
    });
};

module.exports = {getPaiementsByCommandes, addPaiement, updatePaiement, deletePaiement, getAllPaiements, getPaiementsStats};
