// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './src/csp-options.js';
import viewsRouter from './src/routes/views.js';
import produitRouter from './src/routes/produits.js';
import panierRouter from './src/routes/paniers.js';
import commandRouter from './src/routes/commandes.js';

// Création du serveur
const app = express();
// Configurer handelbars
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/public',express.static('./src/public'));

// Ajouter les routers
app.use('/', viewsRouter);
app.use('/api/produits', produitRouter);
app.use('/api/panier', panierRouter);
app.use('/api/commandes', commandRouter);

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
