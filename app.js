// Importe le framework Express, qui facilite la création d'applications web en Node.js
const express = require('express');
// Importe le module Mongoose pour la communication avec la base de données MongoDB
const mongoose = require('mongoose');
// Import de helmet pour sécuriser les en-têtes HTTP.
const helmet = require('helmet');
//Import mongoSanitize pour sécuriser les données entrantes dans une application Express.js
const mongoSanitize = require('express-mongo-sanitize');

// Charge les variables d'environnement depuis un fichier .env
require('dotenv').config()

// Importe les routes pour les livres et les utilisateurs
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')

// Importe le module 'path' pour la gestion des chemins de fichiers
const path = require('path');

// Établit la connexion à la base de données MongoDB en utilisant l'URI stockée dans la variable d'environnement
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // Crée une instance d'Express
const app = express();

// Utilise le middleware pour analyser les requêtes au format JSON
app.use(express.json());
// Utilise Helmet pour configurer les en-têtes de sécurité
app.use(helmet({
  crossOriginResourcePolicy: {policy: "same-site"},
  crossOriginEmbedderPolicy: {policy: "require-corp"}
}));

// Configure les en-têtes de réponse pour permettre les requêtes cross-origin (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Utilise mongoSantize pour sécuriser les données entrantes
app.use(mongoSanitize());

// Utilise les routes spécifiées pour les livres et les utilisateurs
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
// Configure Express pour servir des fichiers statiques, tels que des images, depuis un répertoire local
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exporte l'application Express configurée pour être utilisée ailleurs dans votre code
module.exports = app;