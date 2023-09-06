// Importe le module Express.js
const express = require('express');
// Crée un routeur Express
const router = express.Router();
// Importe le contrôleur utilisateur
const userCtrl = require('../controllers/user');

// Définit les routes pour l'inscription et la connexion des utilisateurs
// Route POST pour l'inscription des utilisateurs
router.post('/signup', userCtrl.signup);
// Route POST pour la connexion des utilisateurs
router.post('/login', userCtrl.login);  

// Exporte le routeur pour une utilisation ultérieure
module.exports = router;