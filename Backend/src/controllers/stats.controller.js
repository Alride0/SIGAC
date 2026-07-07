const db = require('../config/db');

const getMesuresStats = (req, res) => {
  db.query('SELECT COUNT(*) as totalClients FROM clients', (err, clientResults) => {
    if (err) {
      return res.status(500).json({ err });
    }

    const totalClients = clientResults[0].totalClients;

    db.query('SELECT COUNT(*) as totalMesures FROM mesures', (err, mesuresResults) => {
      if (err) {
        return res.status(500).json({ err });
      }

      const totalMesures = mesuresResults[0].totalMesures;

      db.query(
        'SELECT m.*, c.nom, c.prenom FROM mesures m JOIN clients c ON m.client_id = c.id ORDER BY m.id DESC LIMIT 1',
        (err, dernierResults) => {
          if (err) {
            return res.status(500).json({ err });
          }

          const derniereMesure = dernierResults.length > 0 ? dernierResults[0] : null;

          db.query(
            `SELECT COUNT(*) as mesuresCeMois FROM mesures WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())`,
            (err, moisResults) => {
              if (err) {
                return res.status(500).json({ err });
              }

              const mesuresCeMois = moisResults[0].mesuresCeMois;

              res.json({
                totalClients,
                totalMesures,
                derniereMesure,
                mesuresCeMois
              });
            }
          );
        }
      );
    });
  });
};

module.exports = { getMesuresStats };