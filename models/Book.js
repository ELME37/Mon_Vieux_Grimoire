// Importe le module Mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');

// Définit le schéma de données pour les livres
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Champ pour l'ID de l'utilisateur qui a créé le livre, requis
    title: { type: String, required: true }, // Champ pour le titre du livre, requis
    author: { type: String, required: true }, // Champ pour l'auteur du livre, requis
    imageUrl: { type: String, required: true }, // Champ pour l'URL de l'image du livre, requis
    year: { type: Number, required: true }, // Champ pour l'année de publication du livre, requis
    genre: { type: String, required: true }, // Champ pour le genre du livre, requis
    ratings: [
        {
            userId: { type: String, required: true }, // Champ pour l'ID de l'utilisateur qui a donné une évaluation/révision, requis
            grade: { type: Number, required: true }, // Champ pour la note attribuée par l'utilisateur, requis
        }
    ],
    averageRating: { type: Number, required: true }, // Champ pour la note moyenne du livre, requis
});

// Exporte le modèle Book basé sur le schéma bookSchema pour une utilisation ultérieure
module.exports = mongoose.model('Book', bookSchema);
