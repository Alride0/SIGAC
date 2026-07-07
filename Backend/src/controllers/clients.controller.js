const db = require("../config/db");
const getAllClients = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const offset = (page - 1) * limit;

  // Requête pour compter le total de clients
  db.query('SELECT COUNT(*) as total FROM clients', (err, countResults) => {
    if (err) {
      return res.status(500).json({ err });
    }

    const total = countResults[0].total;

    // Requête pour récupérer les clients paginés
    db.query(
      'SELECT * FROM clients ORDER BY date_creation DESC LIMIT ? OFFSET ?',
      [limit, offset],
      (err, results) => {
        if (err) {
          return res.status(500).json({ err });
        }

        res.json({
          results,
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        });
      }
    );
  });
};

const createClient = (req, res) => {
  const { nom, prenom, telephone, adresse } = req.body;

  db.query(
    'SELECT id FROM clients WHERE telephone = ?',
    [telephone],
    (err, results) => {
      if (err) {
        return res.status(500).json({ err });
      }

      if (results.length > 0) {
        return res.status(400).json({
          error: "Ce numéro de téléphone existe déjà"
        });
      }

      // Insertion uniquement si le numéro n'existe pas
      db.query(
        'INSERT INTO clients (nom, prenom, telephone, adresse, date_creation) VALUES (?, ?, ?, ?, NOW())',
        [nom, prenom, telephone, adresse],
        (err, results) => {
          if (err) {
            return res.status(500).json({ err });
          }

          return res.status(201).json(results);
        }
      );
    }
  );
};
const deleteClient = (req, res) => {
 const id =req.params.id; 
 db.query('DELETE FROM clients WHERE id = ?', [id], (err, results) => { 
if(err){ res.status(500).json({err});} 
else { res.json({results});} });}

const updateClient = (req, res) => {

    const id = req.params.id;
    const {nom, prenom, telephone, adresse} = req.body;
    db.query('UPDATE clients SET nom = ?, prenom = ?, telephone = ?, adresse = ? WHERE id= ?', [nom,prenom,telephone,adresse, id],(err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    })
}
module.exports = {getAllClients, createClient, deleteClient,updateClient};
