// Importe le module bcrypt pour hacher les mots de passe
const bcrypt = require('bcrypt');
// Importe le module jsonwebtoken pour gérer les tokens JWT
const jwt = require('jsonwebtoken');
// Importe le modèle User qui représente les utilisateurs
const User = require('../models/User');

// Charge les variables d'environnement depuis un fichier .env
require('dotenv').config();

// Fonction de validation d'une adresse e-mail
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Expression régulière pour valider l'e-mail
    return emailRegex.test(email); // Vérifie si l'e-mail correspond au format attendu
};

// Fonction de validation d'un mot de passe
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/; // Expression régulière pour valider le mot de passe
    return passwordRegex.test(password); // Vérifie si le mot de passe respecte les critères de complexité
};

// Fonction qui gère l'inscription d'un nouvel utilisateur.
exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    // Valide l'adresse e-mail en utilisant une expression régulière
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Adresse e-mail invalide' });
    }

    // Valide le mot de passe en utilisant une expression régulière
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Mot de passe invalide' });
    }

    // Hache le mot de passe pour le stocker de manière sécurisée
    bcrypt.hash(password, 10)
        .then(hash => {
            // Crée un nouvel utilisateur avec l'e-mail et le mot de passe haché
            const user = new User({
                email: email,
                password: hash,
            });
            // Enregistre l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Fonction qui gère la connexion d'un utilisateur.
exports.login = (req, res, next) => {
    const { email, password } = req.body;

    // Valide l'adresse e-mail en utilisant une expression régulière
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Adresse e-mail invalide' });
    }

    // Recherche l'utilisateur par son adresse e-mail
    User.findOne({ email: email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                // Compare le mot de passe fourni avec le mot de passe haché stocké dans la base de données
                bcrypt.compare(password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } else {
                            // Si les identifiants sont valides, génère un token JWT
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.PRIVATE_KEY,
                                    { expiresIn: '4h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
