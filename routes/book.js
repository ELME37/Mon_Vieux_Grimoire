// Importe le module Express.js
const express = require('express');
// Importe le middleware d'authentification
const auth = require('../middleware/auth');
// Crée un routeur Express
const router = express.Router();
// Importe le middleware de gestion de fichiers (multer)
const sharpMulter = require ('../middleware/multer-config')
// Importe le contrôleur pour les opérations liées aux livres
const bookCtrl = require('../controllers/book');

// Définit les routes pour les opérations sur les livres
// Route GET pour obtenir la liste de tous les livres
router.get('/', bookCtrl.getAllBooks);
// Route GET pour obtenir les livres les mieux notés
router.get('/bestrating', bookCtrl.getBestRatedBooks);
// Route GET pour obtenir un livre spécifique par son ID
router.get('/:id', bookCtrl.getOneBook);

// Route POST pour créer un nouveau livre
router.post('/', auth, sharpMulter, bookCtrl.createBook);
// Route POST pour créer une évaluation/révision d'un livre par son ID
router.post('/:id/rating', auth, sharpMulter, bookCtrl.createRating);

// Route PUT pour mettre à jour un livre par son ID
router.put('/:id', auth, sharpMulter, bookCtrl.modifyBook);

 // Route DELETE pour supprimer un livre par son ID
router.delete('/:id', auth, bookCtrl.deleteBook);

// Exporte le routeur pour une utilisation ultérieure
module.exports = router;