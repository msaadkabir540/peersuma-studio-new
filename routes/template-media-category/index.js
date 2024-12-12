const express = require('express');

const {
  getAll,
  createCategory,
  updateTemplateMediaCategory,
  deleteTemplateMediaCategory,
} = require('../../controllers/template-media-category');

const app = express.Router();

app.get('/', getAll);
app.post('/', createCategory);
app.put('/', updateTemplateMediaCategory);
app.delete('/', deleteTemplateMediaCategory);

module.exports = app;
