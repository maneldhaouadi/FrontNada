const express = require('express');
const cors = require('cors');
const app = express();

// Configurez les options CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre front-end
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

// Utilisez CORS avec les options configurées
app.use(cors(corsOptions));

// Autres configurations et routes de votre serveur
