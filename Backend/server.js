const express = require('express');
const dotenv = require('dotenv');
const db = require("./src/config/db");
const clientsRoute = require('./src/routes/clients.routes.js');
const mesuresRoute = require('./src/routes/mesures.routes.js');
const commandesRoute = require('./src/routes/commandes.routes.js');
const paiementsRoute = require('./src/routes/paiements.routes.js');
const statsRoute = require('./src/routes/stats.routes.js');
const cors = require('cors');



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(clientsRoute);
app.use(mesuresRoute);
app.use(commandesRoute);
app.use(paiementsRoute);
app.use(statsRoute);


const PORT = process.env.PORT || 3000;
callback = () => {console.log(`Le serveur a démaré sur le port ${PORT}`)};
app.listen(PORT, callback);
