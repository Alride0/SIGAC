const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",       // remplace par tes identifiants
  password: "root1234",
  database: "gens_couture_db"
});

const telephoneRecherche = "12345678' OR '1'='1"; // payload d'injection

// VERSION VULNÉRABLE (concaténation directe)
console.log("VERSION VULNÉRABLE (concaténation)");
const requeteVulnerable = `SELECT * FROM clients_test_vuln WHERE telephone = '${telephoneRecherche}'`;
console.log("Requête envoyée :", requeteVulnerable);

db.query(requeteVulnerable, (err, results) => {
  if (err) {
    console.log("Erreur SQL :", err.message);
  } else {
    console.log("Résultats obtenus :", results);
    console.log(`--> ${results.length} ligne(s) retournée(s)`);
  }

  //  VERSION SÉCURISÉE (requête paramétrée)
  console.log("\n VERSION SÉCURISÉE (paramétrée) ");
  const requeteSecurisee = "SELECT * FROM clients_test_vuln WHERE telephone = ?";
  console.log("Requête envoyée :", requeteSecurisee, "avec paramètre:", telephoneRecherche);

  db.query(requeteSecurisee, [telephoneRecherche], (err2, results2) => {
    if (err2) {
      console.log("Erreur SQL :", err2.message);
    } else {
      console.log("Résultats obtenus :", results2);
      console.log(`--> ${results2.length} ligne(s) retournée(s)`);
    }
    db.end();
  });
});