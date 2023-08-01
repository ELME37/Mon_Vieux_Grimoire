const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/Book');

mongoose.connect('mongodb+srv://MickaelOCR:Azerty123456789@cluster0.t1fbysk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/books', (req, res, next) => {
  delete req.body.userId;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ mesage: 'Livre enregistré'}))
    .catch(error => res.status(400).json({ error }));
});

app.put('/api/books/:id', (req, res, next) => {
  Book.updateOne({ userId: req.params.id }, { ...req.body, userId: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/books/:id', (req, res, next) => {
  Book.deleteOne({ userId: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => {
  Book.findOne({ userId: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/books', (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json ({ error }));
});

module.exports = app;