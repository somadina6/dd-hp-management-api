const express = require('express');
const characterRoutes = require('./routes/characterRoutes');

const app = express();

app.use(express.json());
app.use('/character', characterRoutes);

module.exports = app;