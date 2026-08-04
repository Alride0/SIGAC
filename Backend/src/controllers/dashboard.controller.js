const db = require('../config/db');

const getDashboardStats = (req, res) => {
    
    const statsQuery = `
    SELECT
        (SELECT COUNT(*) FROM clients) AS totalClients,
        (SELECT COUNT(*) FROM clients WHERE MONTH(date_creation) = MONTH(NOW()) AND YEAR(date_creation) = YEAR(NOW())) AS clientsCeMois,
        (SELECT COUNT(*) FROM commandes WHERE statut = 'EN_COURS') AS commandesEnCours,
        (SELECT COUNT(*) FROM commandes WHERE statut = 'EN_COURS' AND MONTH(date_commande) = MONTH(NOW())) AS commandesEnCoursCeMois,
        (SELECT COUNT(*) FROM commandes WHERE statut = 'TERMINE') AS commandesTerminees,
        (SELECT COUNT(*) FROM commandes WHERE statut = 'TERMINE' AND MONTH(date_commande) = MONTH(NOW())) AS commandesTermineesCeMois,
        (SELECT SUM(montant) FROM paiements) AS totalEncaisse
`;

    db.query(statsQuery, (err, statsResults) => {
        if (err) return res.status(500).json({ err });
        const stats = statsResults[0];

        
        const donutQuery = `
            SELECT statut, COUNT(*) as count
            FROM commandes
            GROUP BY statut
        `;

        db.query(donutQuery, (err, donutResults) => {
            if (err) return res.status(500).json({ err });

            
            const evolutionQuery = `
                SELECT DATE(date_commande) as date, COUNT(*) as count
                FROM commandes
                WHERE date_commande >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY DATE(date_commande)
                ORDER BY date ASC
            `;

            db.query(evolutionQuery, (err, evolutionResults) => {
                if (err) return res.status(500).json({ err });

                
                const paiementsQuery = `
                    SELECT SUM(avance) as totalAvances, SUM(reste) as totalReste
                    FROM paiements
                `;

                db.query(paiementsQuery, (err, paiementsResults) => {
                    if (err) return res.status(500).json({ err });

                    
                    const typeQuery = `
                        SELECT type_vetement, COUNT(*) as count
                        FROM commandes
                        GROUP BY type_vetement
                        ORDER BY count DESC
                    `;

                    db.query(typeQuery, (err, typeResults) => {
                        if (err) return res.status(500).json({ err });

                        
                        const activitesQuery = `
                                (SELECT 'commande' as type, c.id, c.type_vetement as label, cl.nom, cl.prenom, c.date_commande as date_event
                                FROM commandes c JOIN clients cl ON c.client_id = cl.id
                                ORDER BY c.date_commande DESC LIMIT 5)
                                UNION ALL
                                (SELECT 'paiement' as type, p.id, CONVERT(CAST(p.montant AS CHAR) USING utf8mb4) as label, cl.nom, cl.prenom, p.date_paiement as date_event
                                FROM paiements p 
                                JOIN commandes c ON p.commande_id = c.id
                                JOIN clients cl ON c.client_id = cl.id
                                ORDER BY p.date_paiement DESC LIMIT 5)
                                UNION ALL
                                (SELECT 'client' as type, cl.id, cl.nom as label, cl.nom, cl.prenom, cl.date_creation as date_event
                                FROM clients cl
                                ORDER BY cl.date_creation DESC LIMIT 5)
                                ORDER BY date_event DESC
                                LIMIT 5
                            `;
                        db.query(activitesQuery, (err, activitesResults) => {
                            if (err) return res.status(500).json({ err });

                           
                            const livraisonsQuery = `
                                    SELECT c.id, c.type_vetement, c.date_livraison, cl.nom, cl.prenom
                                    FROM commandes c
                                    JOIN clients cl ON c.client_id = cl.id
                                    WHERE c.date_livraison >= NOW() AND c.statut != 'TERMINE' AND c.statut != 'LIVRE'
                                    ORDER BY c.date_livraison ASC
                                    LIMIT 5
                                `;

                            db.query(livraisonsQuery, (err, livraisonsResults) => {
                                if (err) return res.status(500).json({ err });

                                res.json({
                                    stats,
                                    donutData: donutResults,
                                    evolutionData: evolutionResults,
                                    paiementsData: paiementsResults[0],
                                    typeData: typeResults,
                                    activites: activitesResults,
                                    livraisons: livraisonsResults
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = { getDashboardStats };