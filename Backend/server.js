const express = require('express');
const dotenv = require('dotenv');
const db = require("./src/config/db");
const clientsRoute = require('./src/routes/clients.routes.js');
const mesuresRoute = require('./src/routes/mesures.routes.js');
const commandesRoute = require('./src/routes/commandes.routes.js');
const paiementsRoute = require('./src/routes/paiements.routes.js');
const statsRoute = require('./src/routes/stats.routes.js');
const authRoute = require('./src/routes/auth.routes.js');
const dashboardRoute = require('./src/routes/dashboard.routes.js');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

// Routes d'authentification EN PREMIER
app.use(authRoute);

// Autres routes
app.use(clientsRoute);
app.use(mesuresRoute);
app.use(commandesRoute);
app.use(paiementsRoute);
app.use(statsRoute);
app.use(dashboardRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Le serveur a démarré sur le port ${PORT}`);
});