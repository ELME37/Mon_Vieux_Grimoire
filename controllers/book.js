// Importe le modèle de données des livres
const Book = require('../models/Book');
// Module File System pour gérer les fichiers
const fs = require('fs');

// Création d'un nouveau livre
exports.createBook = (req, res, next) => {
  // Parse les données du livre depuis le corps de la requête
  const bookObject = JSON.parse(req.body.book);
  // Supprime l'ID du livre s'il existe
  delete bookObject._id;
  // Supprime l'ID de l'utilisateur s'il existe
  delete bookObject.userId;

  // Crée une nouvelle instance de livre avec les données du livre et l'ID de l'utilisateur
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Utilise l'ID de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` // Génère l'URL de l'image en utilisant le protocole et le nom de fichier téléchargé
  });

  // Enregistre le livre dans la base de données
  book.save()
    .then(() => { res.status(201).json({ message: "Livre enregistré !" }) })
    .catch(error => { res.status(400).json({ error }) });
};

// Modification d'un livre existant
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  // Supprime l'ID de l'utilisateur s'il existe
  delete bookObject._userId;

  // Recherche le livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' }); // Vérifie si l'utilisateur est autorisé à modifier ce livre
      } else {
        // Met à jour le livre avec les nouvelles données
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => { res.status(400).json({ error }) });
}

// Suppression d'un livre existant
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' }); // Vérifie si l'utilisateur est autorisé à supprimer ce livre
      } else {
        // Supprime le fichier image associé
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => { res.status(500).json({ error }) });
}

// Récupération des détails d'un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
}

// Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

// Création d'une notation (rating) pour un livre
exports.createRating = (req, res, next) => {
  const ratingValue = req.body.rating; // Récupère la valeur de la notation depuis le corps de la requête
  const validRatings = [1, 2, 3, 4, 5]; // Liste des notes valides

  // Vérifie si la note se trouve parmi les notes valides
  if (!validRatings.includes(ratingValue)) {
    return res.status(400).json({ message: 'La notation doit être comprise entre 1 et 5' });
  }

  Book.findOne({ _id: req.params.id })
    .then(book => {
      const userRating = book.ratings.find(rating => rating.userId === req.auth.userId);

      if (userRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre !' }); // Vérifie si l'utilisateur a déjà noté ce livre
      }

      // Ajoute la notation à la liste des notations du livre
      book.ratings.push({ userId: req.auth.userId, grade: ratingValue });

       // Calcule la nouvelle moyenne des notations
      let sumRatings = 0;
      let numberRatings = book.ratings.length;

      for (const rating of book.ratings) {
        sumRatings += rating.grade; // Ajoute la note de chaque notation existante à la somme
      }

      // Calcule la nouvelle note moyenne en divisant la somme des notations par le nombre total de notations
      let newAverageRatings = (sumRatings / numberRatings).toFixed(1);

      // Met à jour la propriété 'averageRating' du livre avec la nouvelle note moyenne calculée
      book.averageRating = newAverageRatings;
      
      // Enregistre les modifications dans la base de données
      book.save()
        .then((savedBook) => { res.status(201).json(savedBook) })
        .catch(error => { res.status(500).json({ error }) });

    })
    .catch(error => res.status(500).json({ error }));
}

// Récupération des trois livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
    .limit(3) // Limite le résultat aux trois premiers
    .then(books => { res.status(200).json(books); })
    .catch(error => { res.status(400).json({ error }) });
}

