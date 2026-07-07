const db = require('../config/db');
const logAction = (db, mesure_id, action, user_name = "Oloumidé") => {
  db.query(
    'INSERT INTO mesures_historique (mesure_id, action, user_name) VALUES (?, ?, ?)',
    [mesure_id, action, user_name],
    (err) => {
      if (err) {
        console.error("Erreur lors du logging", err);
      }
    }
  );
};
const getMesuresByClient = (req, res) => {
    const client_id = req.params.client_id;
    db.query('SELECT * FROM mesures WHERE client_id = ?',[client_id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            res.json({results});
        }
    })
}
const addMesures = (req, res) => {
    const client_id = req.params.client_id;
    const {poitrine, taille, hanche, epaule, manche, longueur, tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet} = req.body;
    db.query('INSERT INTO mesures(poitrine, taille, hanche, epaule, manche, longueur, tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet, client_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[poitrine, taille, hanche, epaule, manche, longueur, tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet, client_id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else{
            logAction(db, results.insertId, "Création des mesures");
            res.json({results});
        }

    });
}
const updateMesures = (req, res) => {
    const id = req.params.id;
    const {poitrine, taille, hanche, epaule, manche, longueur, tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet} = req.body;
    db.query('UPDATE mesures SET poitrine = ?, taille = ?, hanche = ?, epaule = ?, manche = ?, longueur = ?, tour_bras = ?, tour_cou = ?, poignet = ?, cuisse = ?, bas_pantalon = ?, mollet = ? WHERE id = ?',[poitrine, taille, hanche, epaule, manche, longueur, tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet, id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
            logAction(db, id, "Modification des mesures");
            res.json({results});
        }

    } );
}
const deleteMesure = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM mesures WHERE id = ?', [id], (err, results) => {
        if(err){
            res.status(500).json({err});
        }
        else {
             logAction(db, id, "Suppression des mesures");
            res.json({results});
        }

    });

}
const getMesuresHistorique = (req, res) => {
  const mesure_id = req.params.mesure_id;
  db.query(
    'SELECT * FROM mesures_historique WHERE mesure_id = ? ORDER BY created_at DESC',
    [mesure_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        res.json({ results });
      }
    }
  );
};
module.exports = {getMesuresByClient,addMesures,updateMesures,deleteMesure,getMesuresHistorique};