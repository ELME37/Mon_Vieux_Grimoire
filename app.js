const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/books', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'livre créé !'
  });
});

app.get('/api/books', (req, res, next) => {
  const book = [
   {
      userId : '1',
      title : 'Mon premier livre',
      author : 'Auteur du premier livre',
      imageUrl : 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 2023,
      genre: 'Fantastic',
      ratings : [
      {
      userId : '1',
      grade : 5,
      }
      ],
      averageRating : 5,
      }
      
  
  ];
  res.status(200).json(book);
});

module.exports = app;