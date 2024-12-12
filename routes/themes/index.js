const express = require('express');
const {
  addThemes,
  getAllThemes,
  deleteThemes,
  getThemeById,
  updateThemes,
} = require('../../controllers/themes');

const app = express.Router();

app.post('/', addThemes);
app.get('/', getAllThemes);
app.put('/:id', updateThemes);
app.get('/:id', getThemeById);
app.delete('/:id', deleteThemes);

module.exports = app;
